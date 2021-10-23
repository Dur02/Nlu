import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { message, Button, Tabs, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, SortAscendingOutlined, CloseOutlined } from '@ant-design/icons';
import { map, flow, reject, propEq, first, propOr, join, find, prop } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { getConditionTypeText } from 'shared/constants/condition-type';
import NLG from './output-response-nlg';
import Condition from './output-response-condition';
import s from './output-responses.less';

const mapWithIndex = map.convert({ cap: false });
const { TabPane } = Tabs;

const DEFAULT_KEY = 'default';

const getCName = flow(
  map(({ params, type }) => `${params[0] || ''}${getConditionTypeText(type)}${params[1] || ''}`),
  join('&'),
);

const result = ({
  responses,
  updateOutput,
  outputId,
}) => {
  useStyles(s);

  const [selectedCId, setSelectedCId] = useState(flow(first, propOr(DEFAULT_KEY, 'cId'))(responses));
  const [creatorConditionVisible, setCreatorConditionVisible] = useState(false);
  const [editorConditionCId, setEditorConditionCId] = useState(null);
  const onCreateResponse = useCallback(async (condition) => {
    const newResponses = mapWithIndex((item, index) => ({
      ...item,
      cId: item.readOnly ? undefined : index.toString(),
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
  const onUpdateNLG = useCallback((cId) => async (nlg) => {
    await updateOutput({
      id: outputId,
      responses: map((item) => {
        if (cId === item.cId) {
          return {
            ...item,
            nlg,
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
        cId: item.readOnly ? undefined : index.toString(),
      })),
    )(responses);
    await updateOutput({
      id: outputId,
      responses: newResponses,
    });
    setSelectedCId(newResponses[0].cId);
  }, [outputId, responses]);

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
        <Button icon={<SortAscendingOutlined />} type="primary">对话回复排序</Button>
      </div>
      <Tabs
        activeKey={selectedCId}
        onTabClick={setSelectedCId}
        type="editable-card"
        hideAdd
      >
        {map(({ cnames, cId, readOnly, condition, nlg }) => (
          <TabPane
            key={readOnly ? DEFAULT_KEY : cId}
            tab={(
              <Tooltip title={readOnly ? '默认' : cnames}>
                <div className={s.Tab}>{readOnly ? '默认' : cnames}</div>
              </Tooltip>
            )}
            closable={!readOnly}
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
            {readOnly ? '默认' : (
              <Button type="link" onClick={() => setEditorConditionCId(cId)}>{getCName(condition)}</Button>
            )}

            <h4 className={s.Title}>回复内容</h4>
            <div className={s.Tips}>支持“#”引用语义槽值、“$”引用资源查询结果</div>
            <NLG
              value={nlg}
              onChange={onUpdateNLG(cId)}
            />
          </TabPane>
        ))(responses)}
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
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  responses: array,
  updateOutput: func.isRequired,
  outputId: number.isRequired,
};

export default result;
