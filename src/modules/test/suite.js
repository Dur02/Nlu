import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Button,
  Modal,
  Radio,
  Table,
  Form,
  Input,
  Select, message,
} from 'antd';
import { useAPITable, useDetails, useForm } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestSuite } from 'shared/actions/test-suite';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { suiteType, normalTest } from 'shared/constants/test-suite';
import { create as createJob } from 'shared/actions/test-job';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { flow, map, remove } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import { columns } from './test-suite-columns';
import { testCaseColumns } from './test-case-columns';

const { Option } = Select;

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
  label: '说法输入类型',
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
  caseIds,
  caseTotal,
  caseCurrent,
  caseSize,
}) => {
  const {
    product,
  } = useSelector((state) => ({
    product: getAllProduct(state),
  }));

  const readAllTestSuite = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(removeTestSuite);
  const readAllTestCase = useAction(readTestCase);
  const onCreateJob = useAction(createJob);

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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
    createButton: {
      text: '创建测试集',
    },
    creator: {
      title: '创建测试集',
      onSubmit: onCreate,
      fields: getFields,
      component: Modal,
      initialValues: {
        suiteType: normalTest,
      },
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
    editor: {
      title: '编辑',
      onSubmit: onUpdate,
      fields: getFields,
      component: Modal,
    },
    showReset: true,
    query: {
      fields: [{
        dataKey: 'title',
        label: '技能名字',
      }],
      searchWhenValueChange: false,
    },
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

  const {
    tableHeader: caseTableHeader,
    pagination: casePagination,
    data: caseData,
    // reload: caseReload,
    reset: caseReset,
  } = useAPITable({
    paginationInitialData: {
      ids: caseIds,
      total: caseTotal,
      current: caseCurrent,
      size: caseSize,
    },
    getDataSource: (state) => flow(
      map((id) => getEntity(`testCase.${id}`)(state)),
      remove((o) => o === undefined),
    ),
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllTestCase({
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
        dataKey: 'refText',
        label: '用户说',
      }, {
        dataKey: 'skillName',
        label: '技能名',
      }],
      searchWhenValueChange: false,
    },
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

  const rowSelection = {
    onChange: (value) => {
      setSelectedRowKeys(value);
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };

  const { submit, submitting, form } = useForm(async (values) => {
    try {
      const { msg } = await onCreateJob({ ...values, jobConfig: { productId: values.productId } });
      message.success(msg);
    } catch (e) {
      message.error(e.msg);
    }
    form.resetFields();
    closeRunForm();
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={columns({
          onRemove,
          openEditor,
          reload,
          pagination,
          openCaseTable,
          setSelectedRowKeys,
          openRunForm,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {caseTableItem && (
        <Modal
          visible={caseTableVisible}
          destroyOnClose
          onCancel={() => {
            closeCaseTable();
            caseReset();
          }}
          footer={null}
          title={`${caseTableItem.title}修改`}
          width={1100}
          zIndex={10}
        >
          {caseTableHeader}
          <Table
            dataSource={caseData}
            columns={testCaseColumns()}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              ...rowSelection,
            }}
            rowKey="id"
            size="small"
            pagination={casePagination}
          />
          <Button
            type="primary"
            ghost
            onClick={() => {
              // eslint-disable-next-line no-console
              console.log(selectedRowKeys);
            }}
          >
            增加
          </Button>
        </Modal>
      )}
      {runFormItem && (
        <Modal
          visible={runFormVisible}
          destroyOnClose
          onCancel={() => {
            closeRunForm();
          }}
          footer={null}
          title={`Run${runFormItem.title}`}
          zIndex={10}
        >
          <Form
            name="basic"
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ testSuiteId: runFormItem.id }}
            autoComplete="off"
            onFinish={submit}
            form={form}
          >
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入标题!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="产品"
              name="productId"
            >
              <Select
                style={{ width: 314 }}
              >
                {
                  map(({ name, id }) => <Option value={id} key={id}>{name}</Option>)(product)
                }
              </Select>
            </Form.Item>
            <Form.Item
              label="测试集ID"
              name="testSuiteId"
              style={{
                display: 'none',
              }}
            >
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                新增任务
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
