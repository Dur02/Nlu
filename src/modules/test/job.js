import React, { useEffect, useState } from 'react';
import Layout from 'shared/components/layout';
import { Button, Modal, Select, Table } from 'antd';
import { useAction } from 'relient/actions';
import { readAll, create, update, cancel as cancelTestJob } from 'shared/actions/test-job';
import { readAll as readAllResult } from 'shared/actions/test-job-result';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import moment from 'moment';
import { flow, map, remove } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { getAllProduct } from 'shared/selectors';
import { RedoOutlined } from '@ant-design/icons';
import { getPassed } from 'shared/constants/test-job';
import { testJobColumns, resultColumns } from './test-job-columns';

const mapWithIndex = map.convert({ cap: false });

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
    detailsVisible: resultVisible,
    openDetails: openResult,
    closeDetails: closeResult,
    detailsItem: resultItem,
  } = useDetails();

  const readAllTestJob = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onCancel = useAction(cancelTestJob);
  const readAllJobResult = useAction(readAllResult);

  const [resultIds, setResultIds] = useState([]);
  const [resultTotal, setResultTotal] = useState(0);
  const [resultCurrent, setResultCurrent] = useState(0);
  const [resultSize, setResultSize] = useState(0);
  const [loading, setLoading] = useState(false);

  const getFields = [{
    label: '标题',
    name: 'title',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: '测试集ID',
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

  const {
    tableHeader: resultTableHeader,
    pagination: resultPagination,
    data: resultData,
    reset: resultReset,
  } = useAPITable({
    paginationInitialData: {
      ids: resultIds,
      total: resultTotal,
      current: resultCurrent,
      size: resultSize,
    },
    getDataSource: (state) => flow(
      map((id) => getEntity(`testJobResult.${id}`)(state)),
      remove((o) => o === undefined),
    ),
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllJobResult({
        ...values,
        page: values.page + 1,
        pageSize: values.size,
        jobId: resultItem.id,
        passed: values.passed === -1 ? '' : values.passed,
      });
      return {
        content: response.data,
        number: response.currentPage - 1,
        size: response.pageSize,
        totalElements: response.total,
      };
    },
    showReset: false,
    filters: [{
      dataKey: 'passed',
      label: '状态',
      defaultValue: -1,
      options: [{
        value: -1,
        label: '全部',
      }, {
        value: 0,
        label: '未通过 ',
      }, {
        value: 1,
        label: '通过',
      }],
    }],
  });

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: '实际值 ',
        dataIndex: 'actual',
      }, {
        title: '期待值',
        dataIndex: 'expected',
      }, {
        title: '测试项',
        dataIndex: 'assertion',
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

      return (
        <Table
          dataSource={mapWithIndex((item, index) => ({
            ...item, key: index,
          }))(JSON.parse(record.jobResult))}
          tableLayout="fixed"
          rowKey="key"
          columns={expandedColumns}
          pagination={false}
          size="small"
        />
      );
    },
    rowExpandable: ({ jobResult }) => jobResult && jobResult !== '',
  };

  useEffect(() => {
    const timer = setInterval(async () => {
      await reload();
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, [reload]);

  return (
    <Layout>
      {tableHeader}
      <Button
        icon={<RedoOutlined />}
        type="primary"
        size="large"
        style={{
          position: 'absolute',
          top: 24,
          left: 140,
        }}
        onClick={async () => {
          setLoading(true);
          await reload();
          setLoading(false);
        }}
        loading={loading}
        disabled={loading}
      >
        刷新状态
      </Button>
      <Table
        tableLayout="fixed"
        dataSource={data}
        columns={testJobColumns({
          openResult,
          readAllJobResult,
          setResultIds,
          setResultTotal,
          setResultSize,
          setResultCurrent,
          onCancel,
          openEditor,
          product,
          caseData,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {resultItem && (
        <Modal
          visible={resultVisible}
          destroyOnClose
          onCancel={async () => {
            resultReset();
            closeResult();
          }}
          footer={null}
          title={`${resultItem.title}结果查看`}
          width={800}
        >
          {resultTableHeader}
          <Table
            // tableLayout="fixed"
            dataSource={resultData}
            columns={resultColumns()}
            rowKey="id"
            size="small"
            pagination={resultPagination}
            expandable={expandable}
          />
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
