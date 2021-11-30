import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { message, Button, Tabs, Tooltip, Popconfirm, Select } from 'antd';
import { PlusOutlined, SortAscendingOutlined, CloseOutlined } from '@ant-design/icons';
import { map, flow, reject, propEq, first, propOr, find, prop, every } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { getCName } from 'shared/utils/helper';
import NLG from './output-response-nlg';
import Condition from './output-response-condition';
import Command from './output-response-command';
import Next from './output-response-next';
import Sorter from './output-response-sorter';
import s from './output-responses.less';

const mapWithIndex = map.convert({ cap: false });
const { TabPane } = Tabs;
const DEFAULT_KEY = 'default';

const commandFirstOptions = [{
  label: '回复内容播报完毕，再执行客户端动作',
  value: 'false',
}, {
  label: '客户端动作执行后，再播报回复内容',
  value: 'true',
}];

const result = ({
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
  const onCreateResponse = useCallback(async (condition) => {
    const newResponses = mapWithIndex((item, index) => ({
      ...item,
      cId: index.toString(),
    }))([{
      condition,
      readOnly: false,
      cnames: getCName(condition),
    }, ...responses]);
    await updateOutput({
      id: outputId,
      responses: newResponses,
    });
    message.success('添加成功');
    setCreatorConditionVisible(false);
    setSelectedCId(newResponses[0].cId);
  }, [outputId, responses]);
  const onUpdateCondition = useCallback(async (condition) => {
    await updateOutput({
      id: outputId,
      responses: map((item) => {
        if (editorConditionCId === item.cId) {
          return {
            ...item,
            condition,
          };
        }
        return item;
      })(responses),
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
            ...item,
            ...response,
          };
        }
        return item;
      })(responses),
    });
    message.success('编辑成功');
    setEditorConditionCId(null);
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
      </div>
      <Tabs
        activeKey={selectedCId}
        onTabClick={setSelectedCId}
        className={s.Tabs}
        type="editable-card"
        hideAdd
        tabPosition="left"
        style={{ height: 700 }}
      >
        {map(({
          cnames,
          cId,
          condition,
          nlg,
          command,
          commandFirst,
          next,
          nextAny,
        }) => {
          const isDefault = !condition
            || condition.length === 0
            || every(({ params }) => !params || params.length === 0)(condition);
          return (
            <TabPane
              key={cId}
              tab={(
                <Tooltip title={isDefault ? '默认' : cnames}>
                  <div className={s.Tab}>{isDefault ? '默认' : cnames}</div>
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
              {isDefault ? '默认' : (
                <Button type="link" onClick={() => setEditorConditionCId(cId)}>{getCName(condition)}</Button>
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
                options={commandFirstOptions}
                value={commandFirst.toString()}
                onChange={(newCommandFirst) => onUpdateResponse({ cId, commandFirst: newCommandFirst === 'true' })}
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
          );
        })(responses)}
      </Tabs>
      <Condition
        visible={creatorConditionVisible}
        onClose={() => setCreatorConditionVisible(false)}
        onChange={onCreateResponse}
        title="添加对话回复"
      />
      <Condition
        visible={!!editorConditionCId}
        onClose={() => setEditorConditionCId(null)}
        onChange={onUpdateCondition}
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
  responses: array,
  intents: array,
  updateOutput: func.isRequired,
  outputId: number.isRequired,
};

export default result;
