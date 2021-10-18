import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Button, Input, message, Popconfirm, Switch, Table } from 'antd';
import { find, propEq, flow, prop, reject } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';
import { useLocalTable } from 'relient-admin/hooks';

import IntentSlots from './intent-slots';
import s from './rules.less';

const { Search } = Input;

const rowExpandable = ({ slots }) => slots && slots.length > 0;

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
  });

  const onRemoveSlot = useCallback(async ({ index, ruleId }) => {
    const selectedRuleSlots = flow(find(propEq('id', ruleId)), prop('slots'))(rules);
    await updateRule({ id: ruleId, slots: reject(propEq('index', index))(selectedRuleSlots) });
  }, [intentId]);

  const columns = [{
    title: '已添加说法',
    dataIndex: 'sentence',
  }, {
    title: '操作',
    width: 120,
    render: (record) => (
      <>
        <div style={{ marginBottom: 8 }}>
          <Switch
            checkedChildren="强说法"
            unCheckedChildren="非强说法"
            onChange={(checked) => onUpdateRule({ id: record.id, taskClassify: checked })}
            checked={prop('taskClassify')(record)}
          />
        </div>
        <div>
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveRule(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        </div>
      </>
    ),
  }];

  const nestedColumns = [{
    title: '语义槽',
    dataIndex: 'name',
  }, {
    title: '取值',
    dataIndex: 'value',
  }, {
    title: '操作',
    width: 80,
    render: (record) => (
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => onRemoveSlot(record)}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    ),
  }];

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

  const expandedRowRender = (record) => (
    <Table
      columns={nestedColumns}
      dataSource={record.slots}
      pagination={false}
    />
  );

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <Search
          onSearch={onCreateRule}
          onChange={onChangeSentence}
          value={newSentence}
          placeholder="请输入说法"
          enterButton="添加"
          className={s.Search}
        />
        <div>
          {tableHeader}
          <Table
            dataSource={getDataSource(rules)}
            columns={columns}
            rowKey="id"
            pagination={pagination}
            expandable={{
              expandedRowRender,
              rowExpandable,
            }}
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
