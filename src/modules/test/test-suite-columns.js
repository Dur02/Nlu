import { time } from 'relient/formatters';
import { getTestSuiteType } from 'shared/constants/test-suite';
import { Button, message, Popconfirm, Upload } from 'antd';
import React, { useCallback, useState } from 'react';
import { flow, includes, map } from 'lodash/fp';
import { func, object, string } from 'prop-types';

const mapWithIndex = map.convert({ cap: false });

const Operations = ({
  record,
  onRemove,
  openEditor,
  reload,
  pagination,
  openCaseTable,
  openRunForm,
  readAllTestCase,
  setCaseData,
  token,
  onSuiteExport,
  setError,
}) => {
  const [uploading, setUploading] = useState(false);

  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
        await reload();
        message.success('上传成功');
      } else if (response.data && response.data.length > 0) {
        flow(mapWithIndex((item, index) => ({ ...item, key: index + 1 })), setError)(response.data);
      } else {
        message.error(response.msg);
      }
      setUploading(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
    }
  }, [setUploading]);

  return (
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
        用例
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
              `${record.title}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.csv`,
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
          if (pagination.current === 1 && pagination.total === 1) {
            reload();
          } else if ((pagination.current - 1) * pagination.pageSize < pagination.total - 1) {
            reload();
          } else {
            reload(pagination.current - 2);
          }
        }}
      >
        <Button type="danger" size="small" ghost>删除</Button>
      </Popconfirm>
    </>
  );
};

Operations.propTypes = {
  record: object.isRequired,
  onRemove: func.isRequired,
  openEditor: func.isRequired,
  reload: func.isRequired,
  pagination: object.isRequired,
  openCaseTable: func.isRequired,
  openRunForm: func.isRequired,
  readAllTestCase: func.isRequired,
  setCaseData: func.isRequired,
  token: string.isRequired,
  onSuiteExport: func.isRequired,
  setError: func.isRequired,
};

export const columns = ({
  onRemove,
  openEditor,
  reload,
  pagination,
  openCaseTable,
  openRunForm,
  readAllTestCase,
  setCaseData,
  token,
  onSuiteExport,
  setError,
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
  title: '操作',
  width: 400,
  render: (record) => (
    <Operations
      record={record}
      onRemove={onRemove}
      openEditor={openEditor}
      reload={reload}
      pagination={pagination}
      openCaseTable={openCaseTable}
      openRunForm={openRunForm}
      readAllTestCase={readAllTestCase}
      setCaseData={setCaseData}
      token={token}
      onSuiteExport={onSuiteExport}
      setError={setError}
    />
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
