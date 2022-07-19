import { Button, Popconfirm } from 'antd';
import React from 'react';
import { prop } from 'lodash/fp';

export default ({
  skillVersionEntity,
  onRemove,
  openEditor,
}) => [{
  title: '产品ID',
  dataIndex: 'productId',
}, {
  title: '技能',
  dataIndex: 'skillId',
  render: (skillId) => prop([skillId, 'name'])(skillVersionEntity),
}, {
  title: '说法',
  dataIndex: 'sentence',
}, {
  title: '回应',
  dataIndex: 'response',
}, {
  title: '类型',
  render: (record) => {
    if (record.type === '1') {
      return 'DM';
    }
    return 'NLU';
  },
}, {
  title: '左匹配',
  render: (record) => (
    String(record.wildLeft)
  ),
}, {
  title: '右匹配',
  render: (record) => (
    String(record.wildRight)
  ),
}, {
  title: '操作',
  width: 140,
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={() => {
          openEditor(record);
        }}
      >
        修改
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
