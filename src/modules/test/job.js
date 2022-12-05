import React, { useCallback, useEffect, useState } from 'react';
import Layout from 'shared/components/layout';
import { Modal, Select, Table, Form, Radio, Button, message } from 'antd';
import { useAction } from 'relient/actions';
import { readAll, create, update, cancel as cancelTestJob } from 'shared/actions/test-job';
import { resultExport } from 'shared/actions/test-job-result';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import moment from 'moment';
import { flow, map, remove } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import { push as pushAction } from 'relient/actions/history';
import { testJobColumns } from './test-job-columns';

const getDataSource = (state) => flow(
  map((id) => getEntity(`testJob.${id}`)(state)),
  remove((o) => o === undefined),
);

const result = ({
  ids,
  total,
  current,
  size,
  caseData,
}) => {
  const {
    product,
  } = useSelector((state) => ({
    product: getAllProduct(state),
  }));

  const {
    detailsVisible: exportVisible,
    openDetails: openExport,
    closeDetails: closeExport,
    detailsItem: exportItem,
  } = useDetails();

  const push = useAction(pushAction);
  const readAllTestJob = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onCancel = useAction(cancelTestJob);
  const onResultExport = useAction(resultExport);

  const [loading, setLoading] = useState(false);

  const getFields = [{
    label: '标题',
    name: 'title',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: '测试集名',
    name: 'testSuiteId',
    component: Select,
    options: caseData,
    allowClear: true,
    rules: [{ required: true }],
  }, {
    element: <b style={{ position: 'relative', left: '80%' }}>Job配置项</b>,
    name: 'jonConfig',
  }, {
    name: ['jobConfig', 'productId'],
    label: '产品',
    placeholder: '产品',
    component: Select,
    options: map((i) => ({ ...i, value: i.id, label: i.name, key: i.id }))(product),
    allowClear: true,
    rules: [{ required: true }],
  }];

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
      text: '创建任务',
    },
    creator: {
      title: '创建任务',
      onSubmit: onCreate,
      fields: getFields,
      component: Modal,
    },
    editor: {
      title: '编辑任务',
      onSubmit: onUpdate,
      fields: getFields,
      component: Modal,
    },
    getDataSource,
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllTestJob({
        ...values,
        status: values.status === -1 ? '' : values.status,
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
    filters: [{
      dataKey: 'status',
      label: '状态',
      defaultValue: -1,
      options: [{
        value: -1,
        label: '全部',
      }, {
        value: 0,
        label: '未执行',
      }, {
        value: 1,
        label: '已执行',
      }, {
        value: 2,
        label: '已取消',
      }, {
        value: 3,
        label: '执行中',
      }],
    }],
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

  const exportSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      const res = await onResultExport({ jobId: exportItem.id, passed: values.passed === -1 ? '' : values.passed });
      const blob = new Blob([res], { type: 'text/plain; charset=utf-8' });
      const blobURL = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      const date = new Date();
      tempLink.setAttribute(
        'download',
        `${exportItem.title}(自动化测试结果导出)-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.csv`,
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
    setLoading(false);
    closeExport();
  }, [exportItem, loading, setLoading]);

  useEffect(() => {
    const timer = setInterval(async () => {
      await reload();
    }, 10000);
    return () => {
      clearInterval(timer);
    };
  }, [reload]);

  return (
    <Layout>
      {tableHeader}
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={testJobColumns({
          onCancel,
          openEditor,
          product,
          caseData,
          openExport,
          push,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {
        exportItem && (
          <Modal
            visible={exportVisible}
            onCancel={() => {
              closeExport();
            }}
            destroyOnClose
            title={`${exportItem.title}导出`}
            width={500}
            footer={null}
          >
            <Form
              name="basic"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 14 }}
              autoComplete="off"
              initialValues={{
                passed: -1,
              }}
              onFinish={exportSubmit}
            >
              <Form.Item
                label="类型"
                name="passed"
                rules={[{ required: true, message: '请输入类型!' }]}
              >
                <Radio.Group>
                  <Radio value={-1}>全部</Radio>
                  <Radio value={0}>未通过</Radio>
                  <Radio value={1}>已通过</Radio>
                </Radio.Group>
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
                  导出
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        )
      }
    </Layout>
  );
};

result.displayName = __filename;

export default result;
