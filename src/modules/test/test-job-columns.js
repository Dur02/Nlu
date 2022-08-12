import { getStatus, getPassed } from 'shared/constants/test-job';
import { Button } from 'antd';
import React from 'react';
import { filter, map, prop, propEq, flow, head } from 'lodash/fp';

export const testJobColumns = ({
  openResult,
  readAllJobResult,
  onCancel,
  openEditor,
  product,
  caseData,
  setResultId,
  readResultNum,
  setResultDetail,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '测试集ID',
  dataIndex: 'testSuiteId',
  render: (testSuiteId) => flow(
    filter(propEq('value', testSuiteId)),
    head,
    prop('label'),
  )(caseData),
}, {
  title: '产品',
  dataIndex: ['jobConfig', 'productId'],
  render: (productId) => flow(
    filter(propEq('id', productId)),
    head,
    prop('name'),
  )(product),
}, {
  title: '状态',
  dataIndex: 'status',
  width: 75,
  render: (status) => getStatus(status),
}, {
  title: '创建者',
  dataIndex: 'creator',
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
              const {
                data: {
                  data: resultData,
                },
              } = await readAllJobResult({ jobId: record.id, page: 1, pageSize: 100 });
              setResultId(map(prop('id'))(resultData));
              openResult(record);
              const {
                data: numData,
              } = await readResultNum({ jobId: record.id });
              setResultDetail(numData);
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
}];
