import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Drawer, Input, message, Table, Switch, Button, Popconfirm } from 'antd';
import { map, join, any, flow, prop, eq, reject, propEq } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import useStyles from 'isomorphic-style-loader/useStyles';
import { booleanSwitchOptions, getBooleanText } from 'shared/constants/boolean';

import WordsList from './words-list';
import s from './rules.less';

const { Search } = Input;

const result = ({
  createRule,
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
  const onCreateSlot = useCallback(
    (values) => {
      if (any(flow(prop('name'), eq(values.name)))(slots)) {
        message.error('取值已存在');
        throw Error('取值已存在');
      }
      return updateIntent({ id: intentId, slots: [values, ...slots] });
    },
    [intentId, slots],
  );
  const onUpdateSlot = useCallback(
    (values, formInstance, editItem) => {
      const { name } = values;
      if (any(flow(
        prop('name'),
        (existingName) => existingName !== editItem.name && existingName === name,
      ))(slots)) {
        message.error('取值已存在');
        throw Error('取值已存在');
      }
      return updateIntent({
        id: intentId,
        slots: map((slot) => {
          if (slot.name === editItem.name) {
            return values;
          }
          return slot;
        })(slots),
      });
    },
    [intentId, slots],
  );
  const onRemoveSlot = useCallback(async ({ name }) => {
    await updateIntent({
      id: intentId,
      slots: reject(propEq('name', name))(slots),
    });
    message.success('删除成功');
  }, [intentId, slots]);

  const fields = [{
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '是否必须',
    name: 'required',
    component: Switch,
    valuePropName: 'checked',
    ...booleanSwitchOptions,
  }, {
    label: '是否有效槽位',
    name: 'isSlot',
    component: Switch,
    valuePropName: 'checked',
    ...booleanSwitchOptions,
  }, {
    label: '词库',
    name: 'lexiconsNames',
    rules: [{ required: true }],
    component: WordsList,
    words,
    createWords,
    updateWords,
    removeWords,
    skillId,
  }];

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
    },
    createButton: {
      text: '创建语义槽',
      size: 'middle',
    },
    creator: {
      title: '创建语义槽',
      onSubmit: onCreateSlot,
      fields,
      component: Drawer,
      width: 600,
    },
    editor: {
      title: '编辑语义槽',
      onSubmit: onUpdateSlot,
      fields,
      component: Drawer,
      width: 600,
    },
  });

  const columns = [{
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '必须',
    dataIndex: 'required',
    width: 60,
    render: getBooleanText,
  }, {
    title: '有效',
    dataIndex: 'isSlot',
    width: 60,
    render: getBooleanText,
  }, {
    title: '词库',
    dataIndex: 'lexiconsNames',
    render: join(', '),
  }, {
    title: '操作',
    width: 80,
    render: (record) => (
      <>
        <div className={s.Button}>
          <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
        </div>
        <div className={s.Button}>
          <Button type="primary" size="small" ghost>绑定槽位</Button>
        </div>
        {prop('canDelete')(record) && (
          <div className={s.Button}>
            <Popconfirm
              title="确认删除吗？删除操作不可恢复"
              onConfirm={() => onRemoveSlot(record)}
            >
              <Button type="danger" size="small" ghost>删除</Button>
            </Popconfirm>
          </div>
        )}
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
        />
        <div>
          {map(({ sentence }) => (
            <div key={sentence}>sentence</div>
          ))(rules)}
        </div>
      </div>
      <div className={s.Words}>
        {tableHeader}
        <Table
          dataSource={getDataSource(slots)}
          columns={columns}
          rowKey="name"
          pagination={pagination}
        />
      </div>
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
