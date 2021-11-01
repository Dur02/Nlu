import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Drawer, message, Table, Switch, Button, Popconfirm } from 'antd';
import { map, join, any, flow, prop, reject, propEq, eq, find, includes } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import useStyles from 'isomorphic-style-loader/useStyles';
import { booleanSwitchOptions, getBooleanText } from 'shared/constants/boolean';
import { PlainText } from 'relient-admin/components';

import WordsList from './words-list';
import Prompt from './intent-slot-prompt';
import s from './intent-slots.less';

const result = ({
  updateIntent,
  createWords,
  updateWords,
  removeWords,
  intentId,
  skillId,
  words,
  slots,
}) => {
  useStyles(s);

  const [promptEditorSlotName, setPromptEditorSlotName] = useState(null);
  const onCreateSlot = useCallback(
    (values) => {
      if (any(flow(prop('name'), includes(',')))(slots)) {
        message.error('词库名不能包含,');
        throw Error('词库名不能包含,');
      }
      if (any(flow(prop('name'), eq(values.name)))(slots)) {
        message.error('取值已存在');
        throw Error('取值已存在');
      }
      return updateIntent({ id: intentId, slots: [values, ...slots] });
    },
    [intentId, slots],
  );
  const onUpdatePrompt = useCallback(async (value) => {
    await updateIntent({
      id: intentId,
      slots: map((slot) => {
        if (slot.name === promptEditorSlotName) {
          return {
            ...slot,
            prompt: value,
          };
        }
        return slot;
      })(slots),
    });
    message.success('编辑成功');
    setPromptEditorSlotName(null);
  }, [promptEditorSlotName, intentId]);
  const onClosePromptEditor = useCallback(() => setPromptEditorSlotName(null), []);

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
      fields: [{
        label: '名称',
        name: 'name',
        type: 'text',
        rules: [{ required: true }],
      }, ...fields],
      component: Drawer,
      width: 600,
    },
    editor: {
      title: '编辑语义槽',
      onSubmit: onUpdateSlot,
      fields: [{
        label: '名称',
        name: 'name',
        component: PlainText,
      }, ...fields],
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
        {prop('required')(record) && (
          <div className={s.Button}>
            <Button type="primary" size="small" ghost onClick={() => setPromptEditorSlotName(record.name)}>提问</Button>
          </div>
        )}
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
      {tableHeader}
      <Table
        dataSource={getDataSource(slots)}
        columns={columns}
        rowKey="name"
        pagination={pagination}
      />
      <Drawer
        title="编辑提问"
        visible={!!promptEditorSlotName}
        onClose={onClosePromptEditor}
        width={600}
      >
        <Prompt
          onCancel={onClosePromptEditor}
          onChange={onUpdatePrompt}
          value={flow(find(propEq('name', promptEditorSlotName)), prop('prompt'))(slots)}
        />
      </Drawer>
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  updateIntent: func.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  intentId: number.isRequired,
  skillId: number.isRequired,
  words: array.isRequired,
  slots: array.isRequired,
};

export default result;
