import { Button, Popconfirm } from 'antd';
import React from 'react';
import { flow, filter, head, prop } from 'lodash/fp';

export default ({
  skills,
  products,
  onRemove,
}) => [{
  title: '产品',
  render: (record) => (
    <p>
      {
        flow(
          filter((item) => (item.id === Number(record.productId))),
          head,
          prop('name'),
        )(products)
      }
    </p>
  ),
}, {
  title: '技能',
  render: (record) => (
    <p>
      {
        flow(
          filter((item) => (item.code === record.skillCode)),
          head,
          prop('name'),
        )(skills)
      }
    </p>
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
      return <p>DM</p>;
    }
    return <p>NLU</p>;
  },
}, {
  title: '左匹配',
  render: (record) => (
    <p>{String(record.wildLeft)}</p>
  ),
}, {
  title: '右匹配',
  render: (record) => (
    <p>{String(record.wildRight)}</p>
  ),
}, {
  title: '操作',
  width: 140,
  render: (record) => (
    <>
      <Button type="primary" ghost size="small">修改</Button>
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
