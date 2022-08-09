import React, { useCallback, useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Button,
  Modal,
  Radio,
  Table,
  Form,
  Input,
  Select,
  message,
  DatePicker,
} from 'antd';
import { useAPITable, useDetails, useForm } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestSuite, caseReplace as caseReplaceAction } from 'shared/actions/test-suite';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { suiteType, normalTest } from 'shared/constants/test-suite';
import { create as createJob } from 'shared/actions/test-job';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { flow, map, prop, remove, union, includes } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { columns } from './test-suite-columns';
import { testCaseColumns } from './test-case-columns';

const { Option } = Select;
const { RangePicker } = DatePicker;

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
  const caseReplace = useAction(caseReplaceAction);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [caseData, setCaseData] = useState({ // Table数据
    data: [],
    total: 0,
    currentPage: 1,
    pageSize: 10,
  });

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

  const paginationProps = {
    defaultCurrent: 1,
    defaultPageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: [10, 20, 50],
    current: caseData.currentPage,
    total: caseData.total,
    pageSize: caseData.pageSize,
    onChange: async (newPage, newPageSize) => {
      const {
        data: dataTemp,
      } = await readAllTestCase({
        page: newPage,
        pageSize: newPageSize,
        startTime: !search.date ? ''
          : moment(new Date(moment(search.date[0]).format('YYYY-MM-DD'))).startOf('day').toISOString(),
        endTime: !search.date ? ''
          : moment(new Date(moment(search.date[1]).format('YYYY-MM-DD'))).endOf('day').toISOString(),
        refText: search.refText,
        skillName: search.skillName,
        intentName: search.intentName,
      });
      setCaseData(dataTemp);
    },
    showTotal: (caseTotal) => `共 ${caseTotal} 条`,
  };

  const rowSelection = {
    onSelect: (record, selected) => {
      if (selected === true) {
        setSelectedRowKeys(union([prop('id')(record)])(selectedRowKeys));
      } else {
        setSelectedRowKeys(remove((o) => o === prop('id')(record))(selectedRowKeys));
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected === true) {
        setSelectedRowKeys(union(map((i) => i.id)(changeRows))(selectedRowKeys));
      } else {
        setSelectedRowKeys(remove((o) => includes(o)(map((i) => i.id)(changeRows)),
        )(selectedRowKeys));
      }
    },
    onSelectNone: () => {
      setSelectedRowKeys([]);
    },
    onSelectInvert: (selectedArray) => {
      setSelectedRowKeys(selectedArray);
    },
    selections: [
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
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

  const getInputValue = useCallback(async (value) => {
    setSearchLoading(true);
    const {
      data: dataTemp,
    } = await readAllTestCase({
      page: 1,
      pageSize: caseData.pageSize,
      startTime: !value.date ? ''
        : moment(new Date(moment(value.date[0]).format('YYYY-MM-DD'))).startOf('day').toISOString(),
      endTime: !value.date ? ''
        : moment(new Date(moment(value.date[1]).format('YYYY-MM-DD'))).endOf('day').toISOString(),
      refText: value.refText,
      skillName: value.skillName,
      intentName: value.intentName,
    });
    setSearch(value);
    setCaseData(dataTemp);
    setSearchLoading(false);
  }, [readAllTestSuite, search, setSearch, caseData, setCaseData]);

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
          readAllTestCase,
          setCaseData,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {caseTableItem && (
        <Modal
          visible={caseTableVisible}
          destroyOnClose
          onCancel={() => {
            setCaseData({});
            setSearch({});
            closeCaseTable();
          }}
          footer={null}
          title={`${caseTableItem.title}修改`}
          width={1100}
          zIndex={10}
        >
          <div
            style={{
              marginBottom: '22px',
            }}
          >
            <Form
              name="basic"
              layout="inline"
              onFinish={getInputValue}
            >
              <Form.Item
                label="用户说"
                name="refText"
                style={{
                  width: '180px',
                }}
              >
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder="输入用户说"
                />
              </Form.Item>
              <Form.Item
                label="技能名"
                name="skillName"
                style={{
                  width: '180px',
                }}
              >
                <Input
                  allowClear
                  autoComplete="off"
                  placeholder="输入技能名"
                />
              </Form.Item>
              <Form.Item
                label="意图名"
                name="intentName"
                style={{
                  width: '180px',
                }}
              >
                <Input
                  autoComplete="off"
                  allowClear
                  placeholder="输入意图名"
                />
              </Form.Item>
              <Form.Item
                label="日期"
                name="date"
                style={{
                  width: '300px',
                }}
              >
                <RangePicker
                  locale={locale}
                  placeholder={['开始日期', '结束日期']}
                  disabledDate={(currentTemp) => currentTemp && currentTemp > moment().endOf('day')}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  ghost
                  size="middle"
                  loading={searchLoading}
                  htmlType="submit"
                >
                  搜索
                </Button>
              </Form.Item>
            </Form>
          </div>
          <Table
            dataSource={caseData.data}
            columns={testCaseColumns()}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              ...rowSelection,
            }}
            rowKey="id"
            size="small"
            pagination={paginationProps}
          />
          <Button
            type="primary"
            ghost
            onClick={async () => {
              setUpdateLoading(true);
              try {
                const { msg } = await caseReplace({
                  caseIds: selectedRowKeys,
                  suiteId: caseTableItem.id,
                });
                message.success(msg);
              } catch (e) {
                // ignore
              }
              setUpdateLoading(false);
              closeCaseTable();
            }}
            loading={updateLoading}
            style={{
              position: 'relative',
              marginTop: '22px',
              left: '50%',
            }}
          >
            修改
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
