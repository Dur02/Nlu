import React, { useCallback, useState } from 'react';
import {
  Button,
  Modal,
  Table,
  Form,
  Input,
  message,
  DatePicker,
} from 'antd';
import { readAll, caseDel } from 'shared/actions/test-suite';
import { create as onCreateCase, readAll as readTestCase, update } from 'shared/actions/test-case';
import { useAction } from 'relient/actions';
import { map, prop, remove, union, includes, flow, reject, concat, sortBy, reverse } from 'lodash/fp';
import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import { bool, func, object } from 'prop-types';
import { useDetails } from 'relient-admin/hooks';
import { testCaseColumns } from '../test-case-columns';

const { useForm } = Form;

const { RangePicker } = DatePicker;

const result = ({
  caseTableItem,
  caseTableVisible,
  closeCaseTable,
  caseData,
  setCaseData,
}) => {
  const [caseCreateForm] = useForm();
  const [caseUpdateForm] = useForm();

  const onUpdate = useAction(update);
  const delCase = useAction(caseDel);
  const readAllTestSuite = useAction(readAll);
  const readAllTestCase = useAction(readTestCase);
  const createCase = useAction(onCreateCase);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    detailsVisible: updateCaseVisible,
    openDetails: openUpdateCase,
    closeDetails: closeUpdateCase,
    detailsItem: updateCaseItem,
  } = useDetails();

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
        testSuiteId: caseTableItem.id,
      });
      setCaseData(dataTemp);
    },
    showTotal: (caseTotal) => `共 ${caseTotal} 条`,
  };

  const rowSelection = {
    onSelect: (record, selected) => {
      if (selected) {
        setSelectedRowKeys(union([prop('id')(record)])(selectedRowKeys));
      } else {
        setSelectedRowKeys(remove((o) => o === prop('id')(record))(selectedRowKeys));
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        setSelectedRowKeys(union(map((i) => i.id)(changeRows))(selectedRowKeys));
      } else {
        setSelectedRowKeys(remove((o) => includes(o)(
          map((i) => i.id)(changeRows),
        ))(selectedRowKeys));
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
      testSuiteId: caseTableItem.id,
    });
    setSearch(value);
    setCaseData(dataTemp);
    setSearchLoading(false);
  }, [readAllTestSuite, search, setSearch, caseData, setCaseData]);

  const caseUpdateSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const { data, msg } = await onUpdate({ id: updateCaseItem.id, ...values });
      setCaseData({
        data: reverse(flow(
          reject(updateCaseItem),
          concat([data]),
          sortBy(['id']),
        )(caseData.data)),
        total: paginationProps.total,
        currentPage: paginationProps.current,
        pageSize: paginationProps.pageSize,
      });
      message.success(msg);
    } catch (e) {
      // message.error(e.msg);
    }
    caseUpdateForm.resetFields();
    setLoading(false);
    closeUpdateCase();
  }, [loading, setLoading, onUpdate, caseUpdateForm, closeUpdateCase, updateCaseItem, caseData]);

  const caseReload = async (current) => {
    const { data } = await readAllTestCase({
      page: current,
      pageSize: paginationProps.pageSize,
      startTime: !search.date ? ''
        : moment(new Date(moment(search.date[0]).format('YYYY-MM-DD'))).startOf('day').toISOString(),
      endTime: !search.date ? ''
        : moment(new Date(moment(search.date[1]).format('YYYY-MM-DD'))).endOf('day').toISOString(),
      refText: search.refText,
      skillName: search.skillName,
      intentName: search.intentName,
      testSuiteId: caseTableItem.id,
    });
    setCaseData(data);
  };

  const caseCreateSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const { msg } = await createCase({ ...values });
      message.success(msg);
    } catch (e) {
      // message.error(e.msg);
    }
    caseCreateForm.resetFields();
    await caseReload(paginationProps.current);
    setLoading(false);
  }, [caseTableItem]);

  return (
    <>
      {caseTableItem && (
        <Modal
          visible={caseTableVisible}
          destroyOnClose
          onCancel={() => {
            setCaseData({});
            setSearch({});
            setSelectedRowKeys([]);
            closeCaseTable();
          }}
          footer={null}
          title={`${caseTableItem.title}包含用例`}
          width={1100}
          zIndex={10}
        >
          <div
            style={{
              marginBottom: '22px',
            }}
          >
            <Form
              form={caseCreateForm}
              name="basic"
              layout="inline"
              autoComplete="off"
              onFinish={caseCreateSubmit}
              initialValues={{
                testSuiteId: caseTableItem.id,
              }}
            >
              <Form.Item
                label="用户说"
                name="refText"
                autoComplete="off"
                style={{
                  width: '200px',
                }}
                rules={[{ required: true, message: '请输入用户说!' }]}
              >
                <Input placeholder="输入用户说" />
              </Form.Item>
              <Form.Item
                label="期待技能"
                name="expectedSkill"
                autoComplete="off"
                style={{
                  width: '200px',
                }}
                rules={[{ required: true, message: '请输入期待技能!' }]}
              >
                <Input placeholder="输入期待技能" />
              </Form.Item>
              <Form.Item
                label="期待意图"
                name="expectedIntent"
                autoComplete="off"
                style={{
                  width: '200px',
                }}
                rules={[{ required: true, message: '请输入期待意图!' }]}
              >
                <Input placeholder="输入期待意图" />
              </Form.Item>
              <Form.Item
                label="joss共享地址"
                name="jossShareUrl"
                autoComplete="off"
                style={{
                  width: '240px',
                }}
              >
                <Input placeholder="输入joss共享地址" />
              </Form.Item>
              <Form.Item
                label="测试集ID"
                name="testSuiteId"
                hidden
              >
                <Input />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  ghost
                  size="middle"
                  // loading={submitting}
                  htmlType="submit"
                  loading={loading}
                >
                  创建
                </Button>
              </Form.Item>
            </Form>
          </div>
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
            columns={testCaseColumns({
              delCase,
              caseTableItem,
              pagination: paginationProps,
              openUpdateCase,
              caseForm: caseUpdateForm,
              caseReload,
            })}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              ...rowSelection,
            }}
            rowKey="id"
            size="small"
            pagination={paginationProps}
          />
          {
            selectedRowKeys.length !== 0 && (
              <Button
                type="danger"
                ghost
                onClick={async () => {
                  setUpdateLoading(true);
                  try {
                    const { msg } = await delCase({
                      caseIds: selectedRowKeys,
                      suiteId: caseTableItem.id,
                    });
                    message.success(msg);
                    const totalPage = Math.floor(
                      (paginationProps.total - selectedRowKeys.length) / paginationProps.pageSize,
                    ) + (
                      (paginationProps.total - selectedRowKeys.length)
                      % paginationProps.pageSize !== 0 ? 1 : 0
                    );
                    // 当修改后剩余的总页数小于当前页码时，把当前页码设为修改后的总页数，否则就重新加载当前页码的内容
                    if (paginationProps.current > totalPage) {
                      await caseReload(totalPage);
                    } else {
                      await caseReload(paginationProps.current);
                    }
                    setSelectedRowKeys([]);
                  } catch (e) {
                    // closeCaseTable();
                    // ignore
                  }
                  setUpdateLoading(false);
                }}
                loading={updateLoading}
                style={{
                  position: 'relative',
                  marginTop: '22px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                批量删除
              </Button>
            )
          }
          {
            updateCaseItem && (
              <Modal
                visible={updateCaseVisible}
                onCancel={() => {
                  closeUpdateCase();
                }}
                destroyOnClose
                title={`${updateCaseItem.id}修改`}
                width={500}
                footer={null}
              >
                <Form
                  form={caseUpdateForm}
                  name="basic"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 14 }}
                  autoComplete="off"
                  onFinish={caseUpdateSubmit}
                >
                  <Form.Item
                    label="用户说"
                    name="refText"
                    autoComplete="off"
                    rules={[{ required: true, message: '请输入用户说!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="期待技能"
                    name="expectedSkill"
                    rules={[{ required: true, message: '请输入期待技能!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="期待意图"
                    name="expectedIntent"
                    rules={[{ required: true, message: '请输入期待意图!' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="joss共享地址"
                    name="jossShareUrl"
                    autoComplete="off"
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{
                      offset: 10,
                    }}
                  >
                    <Button
                      type="primary"
                      ghost
                      size="middle"
                      htmlType="submit"
                      loading={loading}
                    >
                      修改
                    </Button>
                  </Form.Item>
                </Form>
              </Modal>
            )
          }
        </Modal>
      )}
    </>
  );
};

result.displayName = __filename;

result.propTypes = {
  // caseTableItem: array.isRequired,
  caseTableVisible: bool.isRequired,
  closeCaseTable: func.isRequired,
  caseData: object.isRequired,
  setCaseData: func.isRequired,
  reload: func.isRequired,
};

export default result;
