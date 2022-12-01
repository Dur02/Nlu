import React from 'react';
import { Button, Popconfirm } from 'antd';

export default ({
  onRemove,
}) => [{
  title: '取值',
  dataIndex: 'word',
}, {
  title: '同义词',
  dataIndex: 'synonym',
  style: {
    wordBreak: 'break-all',
  },
}, {
  title: '操作',
  width: 70,
  render: (record) => (
    <>
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={() => onRemove(record)}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
