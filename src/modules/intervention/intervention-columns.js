import { Button, Popconfirm } from 'antd';
import React from 'react';
import { map, prop } from 'lodash/fp';

export default ({
  skillVersionEntity,
  onRemove,
  openEditor,
  productEntity,
  setSkills,
  readSkillVersionsByProduct,
  setLoading,
  setInventionType,
}) => [{
  title: '产品',
  dataIndex: 'productId',
  render: (productId) => prop([productId, 'name'])(productEntity),
}, {
  title: '技能',
  dataIndex: 'skillId',
  render: (skillId) => prop([skillId, 'name'])(skillVersionEntity),
}, {
  title: '说法',
  dataIndex: 'sentence',
}, {
  title: '回复',
  dataIndex: 'response',
}, {
  title: '类型',
  dataIndex: 'type',
  render: (type) => {
    if (type === '1') {
      return 'DM';
    }
    return 'NLU';
  },
}, {
  title: '左匹配',
  dataIndex: 'wildLeft',
  render: (wildLeft) => (
    String(wildLeft)
  ),
}, {
  title: '右匹配',
  dataIndex: 'wildRight',
  render: (wildRight) => (
    String(wildRight)
  ),
}, {
  title: '状态',
  dataIndex: 'label',
  render: (label) => {
    switch (label) {
      case 0:
        return '删除';
      case 1:
        return '正常';
      default:
        return '废弃';
    }
  }
  ,
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
}, {
  title: '操作',
  width: 140,
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
          openEditor(record);
          setLoading(true);
          const { data } = await readSkillVersionsByProduct({
            productId: record.productId,
            status: 1,
          });
          setSkills(map(({ intents, name, id }) => ({
            intents,
            label: name,
            value: id,
          }))(data.skills));
          setInventionType(record.type);
          setLoading(false);
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
