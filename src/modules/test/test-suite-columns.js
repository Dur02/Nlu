import { time } from 'relient/formatters';
import { getTestSuiteType } from 'shared/constants/test-suite';
import { Button, message, Popconfirm, Upload } from 'antd';
import React from 'react';
import { includes } from 'lodash/fp';
// import {DownloadOutlined, UploadOutlined} from '@ant-design/icons';

export const columns = ({
  onRemove,
  openEditor,
  reload,
  pagination,
  openCaseTable,
  openRunForm,
  readAllTestCase,
  setCaseData,
  uploading,
  onUpload,
  token,
  onSuiteExport,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '测试集类型',
  dataIndex: 'suiteType',
  width: 150,
  render: (status) => getTestSuiteType(status),
}, {
  title: '测试用例个数',
  // width: 180,
  dataIndex: 'testCaseNum',
}, {
  title: '描述',
  dataIndex: 'description',
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  width: 160,
  render: time(),
}, {
  title: '更新时间',
  dataIndex: 'updateTime',
  width: 160,
  render: time(),
}, {
  title: '操作',
  width: 400,
  render: (record) => (
    <>
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
          openRunForm(record);
        }}
      >
        Run
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
          openCaseTable(record);
          const {
            data: dataTemp,
          } = await readAllTestCase({
            page: 1,
            pageSize: 10,
            testSuiteId: record.id,
          });
          setCaseData(dataTemp);
        }}
      >
        修改用例
      </Button>
      &nbsp;&nbsp;
      <Upload
        name="file"
        onChange={onUpload}
        showUploadList={false}
        action={
          () => `/skill/edit/test/suite/import?title=${record.title}&suiteType=${record.suiteType}&testSuiteId=${record.id}`
        }
        headers={{ token }}
      >
        <Button
          type="primary"
          ghost
          // icon={<UploadOutlined />}
          loading={uploading}
          size="small"
        >
          导入
        </Button>
      </Upload>
      &nbsp;&nbsp;
      <Button
        type="primary"
        ghost
        // icon={<DownloadOutlined />}
        size="small"
        onClick={async () => {
          // setLoading(true);
          try {
            const res = await onSuiteExport({ testSuiteId: record.id });
            const blob = new Blob([res], { type: 'text/plain; charset=utf-8' });
            const blobURL = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');
            tempLink.style.display = 'none';
            tempLink.href = blobURL;
            const date = new Date();
            tempLink.setAttribute(
              'download',
              `${record.title}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.csv`,
            );
            if (typeof tempLink.download === 'undefined') {
              tempLink.setAttribute('target', '_blank');
            }
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            window.URL.revokeObjectURL(blobURL);
            message.success('导出成功');
          } catch (e) {
            message.error('导出失败');
          }
          // setLoading(false);
        }}
      >
        导出
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        ghost
        size="small"
        onClick={async () => {
          openEditor(record);
        }}
      >
        修改信息
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

export const testSuiteColumns = ({
  bindItem,
  addCaseToSuite,
  delCaseFromSuite,
}) => [{
  title: 'ID',
  dataIndex: 'id',
  width: 70,
}, {
  title: '标题',
  dataIndex: 'title',
}, {
  title: '描述',
  dataIndex: 'description',
}, {
  title: '测试集类型',
  dataIndex: 'suiteType',
  width: 150,
  render: (status) => getTestSuiteType(status),
}, {
  title: '创建时间',
  dataIndex: 'createTime',
  width: 160,
  render: time(),
}, {
  title: '操作',
  width: 70,
  render: (record) => (
    <>
      {
        includes(bindItem.id)(record.testCases) ? (
          <Button
            type="primary"
            danger
            ghost
            size="small"
            onClick={async () => {
              const { code, msg } = await delCaseFromSuite({
                caseIds: [bindItem.id],
                suiteId: record.id,
              });
              switch (code) {
                case 'SUCCESS':
                  message.success(msg);
                  break;
                default:
                  message.error(msg);
              }
            }}
          >
            移除
          </Button>
        ) : (
          <Button
            type="primary"
            ghost
            size="small"
            onClick={async () => {
              const { code, msg } = await addCaseToSuite({
                caseIds: [bindItem.id],
                suiteId: record.id,
              });
              switch (code) {
                case 'SUCCESS':
                  message.success(msg);
                  break;
                default:
                  message.error(msg);
              }
            }}
          >
            添加
          </Button>
        )
      }
    </>
  ),
}];
