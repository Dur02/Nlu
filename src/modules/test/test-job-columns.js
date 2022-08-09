import { time } from 'relient/formatters';
import { getStatus, getPassed } from 'shared/constants/test-job';
import { Button } from 'antd';
import React from 'react';
import { map, prop } from 'lodash/fp';

export const testJobColumns = ({
  openResult,
  readAllJobResult,
  setResultIds,
  setResultTotal,
  setResultSize,
  setResultCurrent,
  onCancel,
  openEditor,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '测试集ID',
  width: 90,
  dataIndex: 'testSuiteId',
}, {
  title: '状态',
  dataIndex: 'status',
  width: 75,
  render: (status) => getStatus(status),
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
  title: '操作',
  width: 80,
  render: (record) => (
    <>
      {
        record.status === 0 && (
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
        )
      }
      {
        record.status === 1 && (
          <Button
            type="primary"
            ghost
            size="small"
            onClick={async () => {
              const { data: {
                currentPage,
                data,
                total,
                pageSize,
              } } = await readAllJobResult({ jobId: record.id, page: 1, pageSize: 10 });
              setResultCurrent(currentPage - 1);
              setResultIds(map(prop('id'))(data));
              setResultTotal(total);
              setResultSize(pageSize);
              openResult(record);
            }}
          >
            查看
          </Button>
        )
      }
      {
        record.status === 3 && (
          <Button
            type="primary"
            ghost
            size="small"
            onClick={async () => {
              onCancel({ id: record.id });
            }}
          >
            取消
          </Button>
        )
      }
    </>
  ),
}];

export const resultColumns = () => [{
  title: 'ID',
  dataIndex: 'id',
  // width: 70,
}, {
  title: '测试用例ID',
  dataIndex: 'testCaseId',
}, {
  title: '测试集ID',
  dataIndex: 'testSuiteId',
}, {
  title: '测试任务ID',
  dataIndex: 'testJobId',
}, {
  title: '用户说',
  dataIndex: 'refText',
}, {
  title: '是否通过',
  dataIndex: 'passed',
  render: (passed) => (
    <span
      style={{
        color: getPassed(passed) === '失败' ? 'red' : 'green',
      }}
    >
      {getPassed(passed)}
    </span>
  ),
}, {
  title: '创建时间',
  dataIndex: 'createTime',
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  render: time(),
}];
