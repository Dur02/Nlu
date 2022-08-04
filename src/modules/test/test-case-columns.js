import { time } from 'relient/formatters';
import { Button, Popconfirm } from 'antd';
import React from 'react';
import { find, flow, get, propEq, filter } from 'lodash/fp';
import { getStatus, getTestCaseSource, getDeleted } from 'shared/constants/test-case';

export default ({
  openEditor,
  onRemove,
  // skills,
  reload,
  pagination,
  setIntentOption,
  skills,
  intents,
}) => [{
  title: '期待技能',
  width: 140,
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
  width: 75,
  render: (status) => getStatus(status),
}, {
  title: '测试用例来源',
  dataIndex: 'testCaseSource',
  width: 120,
  render: (testCaseSource) => getTestCaseSource(testCaseSource),
}, {
  title: '音频',
  dataIndex: 'audioFile',
}, {
  title: '删除',
  dataIndex: 'deleted',
  width: 75,
  render: (deleted) => getDeleted(deleted),
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
          const intentTemp = filter(
            propEq('skillId', flow(
              find(propEq('skillCode', record.skillCode)),
              get('key'),
            )(skills)),
          )(intents);

          openEditor({
            ...record,
            expectedIntentTemp: record.expectedIntent,
            expectedRuleTemp: record.expectedRule,
            expectedSkill: record.skillCode,
            skillCode: record.expectedSkill,
          });

          setIntentOption(intentTemp);
        }}
      >
        修改
      </Button>
      &nbsp;&nbsp;
      <Popconfirm
        title="确认删除吗？删除操作不可恢复"
        onConfirm={async () => {
          await onRemove({ id: record.id });
          if ((pagination.current - 1) * pagination.pageSize < pagination.total - 1) {
            reload();
          } else {
            reload(pagination.current - 2);
          }
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  ),
}];
