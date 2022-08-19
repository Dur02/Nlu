import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Button, Input, message, Popconfirm, Switch, Table } from 'antd';
import { prop, flow, map } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useLocalTable } from 'relient-admin/hooks';
import EditableCell from 'shared/components/editable-cell';

import IntentSlots from './intent-slots';
import s from './rules.less';

const { Search } = Input;

const result = ({
  createRule,
  updateRule,
  removeRule,
  updateIntent,
  createWords,
  updateWords,
  removeWords,
  intentId,
  skillId,
  rules,
  words,
  slots,
}) => {
  useStyles(s);

  const [selectedIds, setSelectedIds] = useState([]);
  const [newSentence, setNewSentence] = useState('');
  const onChangeSentence = useCallback(
    ({ target: { value } }) => setNewSentence(value),
    [],
  );
  const onCreateRule = useCallback(async () => {
    await createRule({ intentId, sentence: newSentence });
    message.success('添加说法成功，请设置槽位');
    setNewSentence('');
  }, [newSentence, intentId]);
  const onUpdateRule = useCallback(async (data) => {
    await updateRule(data);
    message.success('编辑成功');
  }, [newSentence, intentId]);
  const onRemoveRule = useCallback(async ({ id }) => {
    await removeRule({ id });
    message.success('删除成功');
  }, []);
  const onRemoveSelectedRules = useCallback(async () => {
    await Promise.all(map((id) => removeRule({ id }))(selectedIds));
    message.success('删除成功');
  }, [selectedIds]);

  const {
    tableHeader,
    getDataSource,
    pagination,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'sentence',
        label: '说法',
      }],
      fussy: true,
    },
  });

  const columns = [{
    title: '已添加说法',
    dataIndex: 'sentence',
    render: (sentence, { id }) => (
      <EditableCell
        value={sentence}
        onSubmit={(value) => onUpdateRule({ sentence: value, id })}
      />
    ),
  }, {
    title: '操作',
    width: 160,
    render: (record) => (
      <>
        <Switch
          checkedChildren="强说法"
          unCheckedChildren="弱说法"
          onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
          checked={prop('taskClassify')(record)}
        />
        &nbsp;&nbsp;
        <Popconfirm
          title="确认删除吗？删除操作不可恢复"
          onConfirm={() => onRemoveRule(record)}
        >
          <Button type="danger" size="small" ghost>删除</Button>
        </Popconfirm>
      </>
    ),
  }];

  const dataSource = getDataSource(rules);

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <div>
          <Search
            onSearch={onCreateRule}
            onChange={onChangeSentence}
            value={newSentence}
            placeholder="请输入说法"
            enterButton="添加"
            className={s.Search}
          />
          {tableHeader}
          <div style={{ marginTop: -40, marginBottom: 20 }}>
            <Button
              onClick={() => flow(map(prop('id')), setSelectedIds)(dataSource)}
              size="small"
              type="primary"
            >
              选中全部
            </Button>
            &nbsp;&nbsp;
            <Button
              onClick={() => setSelectedIds([])}
              size="small"
            >
              取消全部
            </Button>
            &nbsp;&nbsp;
            <Popconfirm
              title="确认删除吗？删除操作不可恢复"
              onConfirm={onRemoveSelectedRules}
            >
              <Button type="danger" ghost size="small">删除选中</Button>
            </Popconfirm>
          </div>
          <Table
            dataSource={dataSource}
            rowSelection={{
              onChange: (selectedRowKeys) => {
                setSelectedIds(selectedRowKeys);
              },
              selectedRowKeys: selectedIds,
            }}
            columns={columns}
            rowKey="id"
            pagination={pagination}
          />
        </div>
      </div>
      <IntentSlots
        updateIntent={updateIntent}
        createWords={createWords}
        updateWords={updateWords}
        removeWords={removeWords}
        intentId={intentId}
        skillId={skillId}
        words={words}
        slots={slots}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  createRule: func.isRequired,
  updateRule: func.isRequired,
  removeRule: func.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  updateIntent: func.isRequired,
  intentId: number.isRequired,
  skillId: number.isRequired,
  rules: array.isRequired,
  words: array.isRequired,
};

export default result;
