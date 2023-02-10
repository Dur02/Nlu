import { getPassed } from 'shared/constants/test-job';
import { Button, Progress, Tag } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import React from 'react';
import { filter, prop, propEq, flow, head } from 'lodash/fp';
import { time } from 'relient/formatters';

export const testJobColumns = ({
  onCancel,
  openEditor,
  product,
  caseData,
  openExport,
  push,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '测试集名',
  dataIndex: 'testSuiteId',
  render: (testSuiteId) => flow(
    filter(propEq('value', testSuiteId)),
    head,
    prop('label'),
  )(caseData) || <Tag color="error">已被删除</Tag>,
}, {
  title: '产品',
  dataIndex: ['jobConfig', 'productId'],
  render: (productId) => flow(
    filter(propEq('id', productId)),
    head,
    prop('name'),
  )(product),
}, {
  title: '进度',
  render: (record) => {
    switch (record.status) {
      case 0:
        return <span><ClockCircleOutlined style={{ color: 'orange' }} />排队中</span>;
      case 1:
        return <span><CheckCircleOutlined style={{ color: 'green' }} />已完成</span>;
      case 2:
        return <span><WarningOutlined style={{ color: 'red' }} />已取消</span>;
      default:
        return <Progress percent={Math.floor(100 * record.progress)} size="small" />;
    }
  },
}, {
  title: '创建者',
  dataIndex: 'creator',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  width: 160,
  render: time(),
}, {
  title: '操作',
  width: 140,
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
          <>
            <Button
              type="primary"
              ghost
              size="small"
              onClick={async () => {
                push(`/test/job/${record.id}/${record.title}`);
              //   const {
              //     data: {
              //       data: resultData,
              //     },
              //   } = await readAllJobResult({ jobId: record.id, page: 1, pageSize: 100 });
              //   setResultId(map(prop('id'))(resultData));
              //   openResult(record);
              //   const {
              //     data: numData,
              //   } = await readResultNum({ jobId: record.id });
              //   setResultDetail(numData);
              }}
            >
              查看
            </Button>
            &nbsp;&nbsp;
            <Button
              type="primary"
              ghost
              size="small"
              onClick={() => {
                openExport(record);
              }}
            >
              导出
            </Button>
          </>
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
  title: '测试用例ID',
  dataIndex: 'testCaseId',
}, {
  title: '用户说',
  dataIndex: 'refText',
}, {
  title: 'Joss链接',
  dataIndex: 'jossResult',
  render: (jossResult) => (jossResult ? <a href={jossResult} target="_blank" rel="noreferrer">点击跳转</a> : '无'),
}, {
  title: 'error',
  dataIndex: 'error',
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
}];
