import { Button, Popconfirm } from 'antd';
import React from 'react';
import { flow, filter, head, prop } from 'lodash/fp';

export default ({
  skills,
  products,
  onRemove,
  openEditor,
}) => [{
  title: '产品',
  render: (record) => (
    flow(
      filter((item) => (item.id === Number(record.productId))),
      head,
      prop('name'),
    )(products)
  ),
}, {
  title: '技能',
  render: (record) => (
    flow(
      filter((item) => (item.code === record.skillCode)),
      head,
      prop('name'),
    )(skills)
  ),
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
