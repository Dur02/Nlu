import React, { useCallback, useEffect, useState } from 'react';
import { func, number, array } from 'prop-types';
import { message, Button, Tabs, Tooltip, Popconfirm, Select } from 'antd';
import { PlusOutlined, SortAscendingOutlined, CloseOutlined } from '@ant-design/icons';
import {
  map,
  flow,
  reject,
  propEq,
  first,
  propOr,
  find,
  prop,
  isString,
  omit,
  size,
  filter,
  nth,
} from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { getCName, getIsDefault } from 'shared/utils/helper';
import { isBoolean } from 'lodash';
import NLG from './output-response-nlg';
import Condition from './output-response-condition';
import Command from './output-response-command';
import Next from './output-response-next';
import Widget from './output-response-widget';
import Sorter from './output-response-sorter';
import s from './output-responses.less';

const mapWithIndex = map.convert({ cap: false });
const { TabPane } = Tabs;
const DEFAULT_KEY = 'default';

const executeSequenceOptions = [{
  label: '回复内容播报完毕，再执行客户端动作',
  value: 'ttsFirst',
}, {
  label: '客户端动作执行后，再播报回复内容',
  value: 'commandFirst',
}, {
  label: '播报的同时执行客户端动作',
  value: 'executeBoth',
}];

const getDefaultConditionSize = flow(
  filter(flow(prop('condition'), getIsDefault)),
  size,
);

const result = ({
  intentId,
  responses,
  updateOutput,
  outputId,
  intents,
}) => {
  useStyles(s);

  const [selectedCId, setSelectedCId] = useState(flow(first, propOr(DEFAULT_KEY, 'cId'))(responses));
  const [sorterVisible, setSorterVisible] = useState(false);
  const [creatorConditionVisible, setCreatorConditionVisible] = useState(false);
  const [editorConditionCId, setEditorConditionCId] = useState(null);

  const onCreateResponse = useCallback(async (condition, cnames) => {
    const newResponses = mapWithIndex((item, index) => ({
      ...item,
      cId: index.toString(),
    }))([{
      condition,
      readOnly: getIsDefault(condition),
      commandFirst: false,
      cnames: cnames || getCName(condition),
    }, ...responses]);
    if (getDefaultConditionSize(newResponses) > 1) {
      message.error('请添加相应的条件再保存');
      return;
    }
    await updateOutput({
      id: outputId,
      responses: newResponses,
    });
    message.success('添加成功');
    setCreatorConditionVisible(false);
    setSelectedCId(newResponses[0].cId);
  }, [outputId, responses]);

  const onUpdateCondition = useCallback(async (condition, cnames) => {
    const newResponses = map((item) => {
      if (editorConditionCId === item.cId) {
        return {
          ...item,
          condition,
          readOnly: getIsDefault(condition),
          cnames: cnames || getCName(condition),
        };
      }
      return item;
    })(responses);
    if (getDefaultConditionSize(newResponses) > 1) {
      message.error('请添加相应的条件再保存');
      return;
    }
    await updateOutput({
      id: outputId,
      responses: newResponses,
    });
    message.success('编辑成功');
    setEditorConditionCId(null);
  }, [outputId, responses, editorConditionCId]);

  const onUpdateResponse = useCallback(async (response) => {
    await updateOutput({
      id: outputId,
      responses: map((item) => {
        if (response.cId === item.cId) {
          return {
            // 执行时序升级新增一个选项，在Selection的value为executeBoth时不传commandFirst这个字段
            // ...item,
            ...omit(response.executeSequence === 'executeBoth' ? ['commandFirst'] : [])(item),
            ...omit(['isDefault'])(response),
          };
        }
        return item;
      })(responses),
    });
    message.success('编辑成功');
  }, [outputId, responses]);

  const onRemoveResponse = useCallback(async ({ cId }) => {
    const newResponses = flow(
      reject(propEq('cId', cId)),
      mapWithIndex((item, index) => ({
        ...item,
        cId: index.toString(),
      })),
    )(responses);
    await updateOutput({
      id: outputId,
      responses: newResponses,
    });
    setSelectedCId(newResponses[0].cId);
  }, [outputId, responses]);

  const onSortResponse = useCallback(async (value) => {
    await updateOutput({
      id: outputId,
      responses: mapWithIndex((item, index) => ({
        ...item,
        cId: index.toString(),
      }))(value),
    });
    message.success('排序成功');
    setSorterVisible(false);
  }, [outputId]);

  const getValue = (executeSequence, commandFirst) => {
    if (isString(executeSequence)) {
      return executeSequence;
    }
    if (isBoolean(commandFirst)) {
      return commandFirst.toString() === 'true' ? 'commandFirst' : 'ttsFirst';
    }
    return undefined;
  };

  // 切换意图时重置选择的cId到首位回复
  useEffect(() => setSelectedCId(flow(first, propOr(DEFAULT_KEY, 'cId'))(responses)), [intentId]);

  return (
    <div>
      <div className={s.Header}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setCreatorConditionVisible(true)}
        >
          添加对话回复
        </Button>
        &nbsp;&nbsp;
        <Button
          icon={<SortAscendingOutlined />}
          type="primary"
          onClick={() => setSorterVisible(true)}
        >
          对话回复排序
        </Button>
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={async () => {
            const temp = {
              ...nth(selectedCId)(responses),
              cnames: `${nth(selectedCId)(responses).cnames}副本`,
              cId: String(responses.length),
              isDefault: false,
            };
            await updateOutput({
              id: outputId,
              responses: [temp, ...responses],
            });
          }}
        >
          复制
        </Button>
      </div>
      <Tabs
        activeKey={selectedCId}
        onTabClick={(value) => {
          setSelectedCId(value);
        }}
        className={s.Tabs}
        type="editable-card"
        hideAdd
        tabPosition="left"
        style={{ height: 700 }}
      >
        {map(({
          cnames,
          condition,
          cId,
          nlg,
          command,
          commandFirst,
          next,
          nextAny,
          isDefault,
          executeSequence,
          widgetName,
          duiWidget,
        }) => (
          <TabPane
            key={cId}
            tab={(
              <Tooltip title={cnames}>
                <div className={s.Tab}>{cnames}</div>
              </Tooltip>
            )}
            closable={!isDefault}
            closeIcon={(
              <Popconfirm
                title="确认删除吗？删除操作不可恢复"
                onConfirm={() => onRemoveResponse({ cId })}
              >
                <CloseOutlined />
              </Popconfirm>
            )}
          >
            <h4 className={s.Title}>条件描述</h4>
            {isDefault ? cnames : (
              <Button style={{ wordWrap: 'break-word', wordBreak: 'break-all', whiteSpace: 'normal' }} type="link" onClick={() => setEditorConditionCId(cId)}>{getCName(condition)}</Button>
            )}

            <h4 className={s.Title}>回复内容</h4>
            <div className={s.Tips}>支持“#”引用语义槽值、“$”引用资源查询结果</div>
            <NLG
              value={nlg}
              onChange={(newNlg) => onUpdateResponse({ cId, nlg: newNlg })}
            />

            <h4 className={s.Title}>客户端动作</h4>
            <div className={s.Tips}>
              向终端设备发出执行操作的指令，支持“?”标识传参，参数之间用“&”连接。示例： command://call?phone=$phone$&name=#name#。
            </div>
            <Command
              value={command}
              onChange={(newCommand) => onUpdateResponse({ cId, command: newCommand })}
            />

            <h4 className={s.Title}>执行时序</h4>
            <Select
              style={{ width: 280 }}
              options={executeSequenceOptions}
              value={getValue(executeSequence, commandFirst)}
              onChange={(newExecuteSequence) => {
                const getCommandFirst = () => {
                  switch (newExecuteSequence) {
                    case 'commandFirst':
                      return true;
                    default:
                      return false;
                  }
                };
                return newExecuteSequence === 'executeBoth'
                  ? onUpdateResponse({
                    cId,
                    // commandFirst: getCommandFirst(),
                    executeSequence: newExecuteSequence,
                  }) : onUpdateResponse({
                    cId,
                    commandFirst: getCommandFirst(),
                    executeSequence: newExecuteSequence,
                  });
              }}
            />

            <h4 className={s.Title}>控件类型</h4>
            <Widget
              responses={responses}
              widgetName={widgetName || ''}
              duiWidget={duiWidget || ''}
              onChange={({ newWidgetName, newDuiWidget }) => onUpdateResponse({
                cId,
                widgetName: newWidgetName,
                duiWidget: newDuiWidget,
              })}
            />

            <h4 className={s.Title}>下一轮对话</h4>
            <Next
              next={next}
              nextAny={nextAny}
              onUpdateResponse={onUpdateResponse}
              cId={cId}
              intents={intents}
            />
          </TabPane>
        ))(responses)}
      </Tabs>
      <Condition
        visible={creatorConditionVisible}
        onClose={() => setCreatorConditionVisible(false)}
        onChange={onCreateResponse}
        title="添加对话回复"
        value={[]}
      />
      <Condition
        visible={!!editorConditionCId}
        onClose={() => setEditorConditionCId(null)}
        onChange={onUpdateCondition}
        cnames={flow(find(propEq('cId', editorConditionCId)), prop('cnames'))(responses)}
        title="编辑条件"
        value={flow(find(propEq('cId', editorConditionCId)), prop('condition'))(responses)}
      />
      <Sorter
        visible={sorterVisible}
        value={responses}
        onClose={() => setSorterVisible(false)}
        onChange={onSortResponse}
        title="排序对话回复"
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  intentId: number.isRequired,
  responses: array,
  intents: array,
  updateOutput: func.isRequired,
  outputId: number.isRequired,
};

export default result;
