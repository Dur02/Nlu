import React, { useCallback, useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Radio,
  Table,
  message,
} from 'antd';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import { readAll, update, remove as removeTestSuite, suiteExport } from 'shared/actions/test-suite';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { create as createJob } from 'shared/actions/test-job';
import { suiteType } from 'shared/constants/test-suite';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { flow, map, remove } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import { columns } from './test-suite-columns';
import TestSuiteCreate from './component/test-suite-create';
import { errorColumns } from './component/test-suite-import-columns';
import UpdateCase from './component/test-suite-update-case';
import RunForm from './component/test-suite-run-form';

const mapWithIndex = map.convert({ cap: false });

const getDataSource = (state) => flow(
  map((id) => getEntity(`testSuite.${id}`)(state)),
  remove((o) => o === undefined),
);

const getFields = [{
  label: '测试集标题',
  name: 'title',
  type: 'text',
  autoComplete: 'off',
  rules: [{ required: true }],
}, {
  label: '测试集类型',
  name: 'suiteType',
  component: Radio.Group,
  options: suiteType,
}, {
  label: '描述',
  name: 'description',
  type: 'text',
  autoComplete: 'off',
}];

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const {
    product,
    token,
  } = useSelector((state) => ({
    product: getAllProduct(state),
    token: getEntity('auth.authorization')(state),
  }));

  const readAllTestSuite = useAction(readAll);
  const onUpdate = useAction(update);
  const onRemove = useAction(removeTestSuite);
  const readAllTestCase = useAction(readTestCase);
  const onCreateJob = useAction(createJob);
  const onSuiteExport = useAction(suiteExport);

  const [caseData, setCaseData] = useState({ // Table数据
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });
  const [error, setError] = useState([]);
  const [uploading, setUploading] = useState(false);

  const {
    detailsVisible: caseTableVisible,
    openDetails: openCaseTable,
    closeDetails: closeCaseTable,
    detailsItem: caseTableItem,
  } = useDetails();

  const {
    detailsVisible: runFormVisible,
    openDetails: openRunForm,
    closeDetails: closeRunForm,
    detailsItem: runFormItem,
  } = useDetails();

  const {
    tableHeader,
    pagination,
    data,
    openEditor,
    reload,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    editor: {
      title: '编辑',
      onSubmit: onUpdate,
      fields: getFields,
      component: Modal,
    },
    getDataSource,
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllTestSuite({
        ...values,
        page: values.page + 1,
        pageSize: values.size,
        startTime: moment(new Date(values.createTimeAfter)).startOf('day').toISOString(),
        endTime: moment(new Date(values.createTimeBefore)).endOf('day').toISOString(),
      });
      return {
        content: response.data,
        number: response.currentPage - 1,
        size: response.pageSize,
        totalElements: response.total,
      };
    },
    showReset: true,
    query: {
      fields: [{
        dataKey: 'title',
        label: '标题',
      }],
      searchWhenValueChange: false,
    },
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

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
    <Layout>
      {tableHeader}
      <TestSuiteCreate
        token={token}
        reload={reload}
      />
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={columns({
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
        })}
        rowKey="id"
        pagination={pagination}
      />
      <UpdateCase
        caseTableItem={caseTableItem}
        caseTableVisible={caseTableVisible}
        closeCaseTable={closeCaseTable}
        caseData={caseData}
        setCaseData={setCaseData}
        reload={reload}
      />
      <RunForm
        runFormItem={runFormItem}
        runFormVisible={runFormVisible}
        closeRunForm={closeRunForm}
        onCreateJob={onCreateJob}
        product={product}
      />
      <Modal
        visible={error.length > 0}
        onOk={() => {
          setError([]);
        }}
        onCancel={() => {
          setError([]);
        }}
        title="错误提示"
        width={1000}
      >
        <Table
          columns={errorColumns}
          dataSource={error}
        />
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
