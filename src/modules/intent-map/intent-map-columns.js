import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';

export default ({
  openEditor,
  onRemove,
  pagination,
  reload,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '意图名',
  dataIndex: 'intentName',
}, {
  title: '技能ID',
  dataIndex: 'skillId',
}, {
  title: '技能名',
  dataIndex: 'skillName',
}, {
  title: 'st意图名',
  dataIndex: 'stIntentName',
}, {
  title: '任务',
  dataIndex: 'task',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
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
        更新
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={async () => {
          await onRemove({ id: record.id });
          if ((pagination.current - 1) * pagination.pageSize < pagination.total - 1) {
            await reload();
          } else {
            await reload(pagination.current - 2);
          }
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
