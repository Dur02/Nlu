import React, { useCallback } from 'react';
import { array, func } from 'prop-types';
import { Drawer, Button, Table, Input, message, Popconfirm } from 'antd';
import { flow, any, reject, first, eq, last } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';

const { TextArea } = Input;

const result = ({
  onChange,
  value,
}) => {
  const onCreate = useCallback(({ word, synonym }) => {
    if (any(flow(first, eq(word)))(value)) {
      message.error('取值已存在');
      throw Error('取值已存在');
    }
    return onChange([[word, synonym], ...value]);
  }, [value, onChange]);
  const onUpdate = useCallback(({ word, synonym }, formInstance, editItem) => {
    if (any(flow(
      first,
      (existingWord) => existingWord !== editItem.word && existingWord === word,
    ))(value)) {
      message.error('取值已存在');
      throw Error('取值已存在');
    }
    return onChange([[word, synonym], ...value]);
  }, [value, onChange]);
  const onRemove = useCallback(([word]) => {
    onChange(reject(flow(first, eq(word)))(value));
  }, [value, onChange]);
  const fields = [{
    label: '取值',
    name: 'word',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '同义词',
    name: 'synonym',
    component: TextArea,
  }];
  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: '0',
        label: '取值',
      }],
    },
    createButton: {
      text: '创建',
      size: 'middle',
    },
    creator: {
      title: '创建词条',
      onSubmit: onCreate,
      fields,
      component: Drawer,
      width: 800,
    },
    editor: {
      title: '编辑词条',
      onSubmit: onUpdate,
      fields,
      component: Drawer,
      width: 800,
    },
  });

  const columns = [{
    title: '取值',
    render: first,
  }, {
    title: '同义词',
    render: last,
  }, {
    title: '操作',
    width: 300,
    render: (record) => (
      <>
        <Button type="primary" size="small" ghost onClick={() => openEditor(record)}>编辑</Button>
        &nbsp;&nbsp;
        <Popconfirm
          title="确认删除吗？删除操作不可恢复"
          onConfirm={() => onRemove(record)}
        >
          <Button type="danger" size="small" ghost>删除</Button>
        </Popconfirm>
      </>
    ),
  }];

  return (
    <div>
      {tableHeader}
      <Table
        dataSource={getDataSource(value)}
        columns={columns}
        rowKey={([word]) => word}
        pagination={pagination}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  onChange: func.isRequired,
  value: array,
};

export default result;
