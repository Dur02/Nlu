import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';

export default ({
  openEditor,
  onRemove,
}) => [{
  title: 'ID',
  dataIndex: 'id',
}, {
  title: '期待技能',
  dataIndex: 'expectedSkill',
}, {
  title: '期待意图',
  dataIndex: 'expectedIntent',
}, {
  title: '期待说法',
  dataIndex: 'expectedRule',
}, {
  title: '描述',
  dataIndex: 'description',
}, {
  title: 'joss共享地址',
  dataIndex: 'jossShareUrl',
}, {
  title: '用户说',
  dataIndex: 'refText',
}, {
  title: '状态',
  dataIndex: 'status',
}, {
  title: '测试用例来源',
  dataIndex: 'testCaseSource',
}, {
  title: '音频',
  dataIndex: 'audioFile',
}, {
  title: '删除',
  dataIndex: 'deleted',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  render: time(),
}, {
  title: '创建者',
  dataIndex: 'creator',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  render: time(),
}, {
  title: 'Action',
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
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
