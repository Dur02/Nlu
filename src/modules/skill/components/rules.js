import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Button, Input, message, Popconfirm, Switch, Table } from 'antd';
import { prop } from 'lodash/fp';
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
        onSubmit={async (value) => {
          await updateRule({ sentence: value, id });
          message.success('编辑说法成功');
        }}
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
