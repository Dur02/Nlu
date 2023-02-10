import React, { useCallback, useState } from 'react';
import {
  Button,
  Modal,
  Table,
  Form,
  Input,
  message,
  DatePicker,
  Select, Popconfirm,
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
const { Option } = Select;
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
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

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
    pageSizeOptions: [10, 20, 50, 100],
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
    // showTotal: (caseTotal) => `共 ${caseTotal} 条`,
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
    setUpdating(true);
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
    setUpdating(false);
    closeUpdateCase();
  }, [updating, setUpdating, onUpdate, caseUpdateForm, closeUpdateCase, updateCaseItem, caseData]);

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
    setCreating(true);
    try {
      const { msg } = await createCase({ ...values });
      message.success(msg);
    } catch (e) {
      // message.error(e.msg);
    }
    caseCreateForm.resetFields();
    await caseReload(paginationProps.current);
    setCreating(false);
  }, [caseTableItem, paginationProps, updating, setUpdating, caseCreateForm]);

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
            caseCreateForm.resetFields();
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
                level: 1,
              }}
            >
              <Form.Item
                label="用户说"
                name="refText"
                autoComplete="off"
                rules={[{ required: true, message: '请输入用户说!' }]}
              >
                <Input
                  placeholder="输入用户说"
                  style={{
                    width: '100px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="期待技能"
                name="expectedSkill"
                autoComplete="off"
                rules={[{ required: true, message: '请输入期待技能!' }]}
              >
                <Input
                  placeholder="输入期待技能"
                  style={{
                    width: '110px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="期待意图"
                name="expectedIntent"
                autoComplete="off"
                // style={{
                //   width: '190px',
                // }}
                rules={[{ required: true, message: '请输入期待意图!' }]}
              >
                <Input
                  placeholder="输入期待意图"
                  style={{
                    width: '110px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="joss共享地址"
                name="jossShareUrl"
                autoComplete="off"
                // style={{
                //   width: '230px',
                // }}
              >
                <Input
                  placeholder="输入joss共享地址"
                  style={{
                    width: '135px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="级别"
                name="level"
              >
                <Select>
                  <Option value={1}>1</Option>
                  <Option value={2}>2</Option>
                  <Option value={3}>3</Option>
                  <Option value={4}>4</Option>
                </Select>
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
                  // updating={submitting}
                  htmlType="submit"
                  loading={creating}
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
                // style={{
                //   width: '150px',
                // }}
              >
                <Input
                  autoComplete="off"
                  placeholder="输入用户说"
                  style={{
                    width: '120px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="期待技能"
                name="skillName"
                // style={{
                //   width: '180px',
                // }}
              >
                <Input
                  autoComplete="off"
                  placeholder="输入期待技能"
                  style={{
                    width: '135px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="期待意图"
                name="intentName"
                // style={{
                //   width: '180px',
                // }}
              >
                <Input
                  autoComplete="off"
                  placeholder="输入期待意图"
                  style={{
                    width: '141px',
                  }}
                />
              </Form.Item>
              <Form.Item
                label="日期"
                name="date"
                // style={{
                //   width: '300px',
                // }}
              >
                <RangePicker
                  locale={locale}
                  placeholder={['开始日期', '结束日期']}
                  disabledDate={(currentTemp) => currentTemp && currentTemp > moment().endOf('day')}
                  style={{
                    width: '250px',
                  }}
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
              caseUpdateForm,
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
              <Popconfirm
                title="确认删除吗？删除操作不可恢复"
                onConfirm={async () => {
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
                    if (paginationProps.current > totalPage && totalPage !== 0) {
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
              >
                <Button
                  type="danger"
                  ghost
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
              </Popconfirm>
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
                  // 当使用useForm控制表单时，resetFields时初始值会是上一次的值而不能动态变化，因为modal和form的生命周期不一致
                  // 当modal内嵌form，而form需要动态变化初始值时
                  // 使用useForm搭配setFieldsValue或者通过initialValues设置初始值
                  form={caseUpdateForm}
                  name="basic"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 14 }}
                  autoComplete="off"
                  onFinish={caseUpdateSubmit}
                  // initialValues={{
                  //   refText: updateCaseItem.refText,
                  //   expectedSkill: updateCaseItem.expectedSkill,
                  //   expectedIntent: updateCaseItem.expectedIntent,
                  //   jossShareUrl: updateCaseItem.jossShareUrl,
                  //   level: updateCaseItem.level,
                  // }}
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
                    label="级别"
                    name="level"
                    // style={{
                    //   width: '110px',
                    // }}
                    // rules={[{ required: true, message: '请输入级别!' }]}
                  >
                    <Select>
                      <Option value={1}>1</Option>
                      <Option value={2}>2</Option>
                      <Option value={3}>3</Option>
                      <Option value={4}>4</Option>
                    </Select>
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
                      loading={updating}
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
