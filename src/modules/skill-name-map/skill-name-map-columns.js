import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';

export default ({
  openEditor,
  onRemove,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: 'AppID',
  dataIndex: 'appId',
}, {
  title: 'App名字',
  dataIndex: 'appName',
}, {
  title: '技能定义名',
  dataIndex: 'skillStandardName',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  width: 160,
  render: time(),
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  width: 160,
  render: time(),
  // width: 180,
}, {
  title: '操作',
  width: 140,
  render: (record) => (
    <>
      <Button
        type="primary"
        size="small"
        ghost
        onClick={() => {
          openEditor(record);
        }}
      >
        编辑
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => {
          onRemove({ id: record.id });
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
