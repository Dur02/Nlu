import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';
// import { flow } from 'lodash/fp';
import { getStatus, getTestCaseSource, getDeleted } from 'shared/constants/test-case';

export default ({
  openEditor,
  onRemove,
  // skills,
  reset,
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
  render: (status) => getStatus(status),
}, {
  title: '测试用例来源',
  dataIndex: 'testCaseSource',
  render: (testCaseSource) => getTestCaseSource(testCaseSource),
}, {
  title: '音频',
  dataIndex: 'audioFile',
}, {
  title: '删除',
  dataIndex: 'deleted',
  render: (deleted) => getDeleted(deleted),
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
  width: 80,
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
          openEditor({
            ...record,
            expectedIntentTemp: record.expectedIntent,
            expectedRuleTemp: record.expectedRule,
            expectedSkill: record.skillCode,
            skillCode: record.expectedSkill,
          });
        }}
      >
        修改
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={async () => {
          // eslint-disable-next-line no-debugger
          // debugger;
          await onRemove({ id: record.id });
          // eslint-disable-next-line no-debugger
          // debugger;
          await reset();
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
