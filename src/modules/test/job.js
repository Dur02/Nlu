import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { Modal, Table } from 'antd';
import { useAction } from 'relient/actions';
import { readAll, create, update, cancel as cancelTestJob } from 'shared/actions/test-job';
import { readAll as readAllResult } from 'shared/actions/test-job-result';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import moment from 'moment';
import { flow, map, remove } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { testJobColumns, resultColumns } from './test-job-columns';

const getDataSource = (state) => flow(
  map((id) => getEntity(`testJob.${id}`)(state)),
  remove((o) => o === undefined),
);

const getFields = [{
  label: '测试集标题',
  name: 'title',
  type: 'text',
  autoComplete: 'off',
  rules: [{ required: true }],
}];

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const {
    detailsVisible: resultVisible,
    openDetails: openResult,
    closeDetails: closeResult,
    detailsItem: resultItem,
  } = useDetails();

  const readAllTestJob = useAction(readAll);
  // eslint-disable-next-line no-unused-vars
  const onCreate = useAction(create);
  // eslint-disable-next-line no-unused-vars
  const onUpdate = useAction(update);
  // eslint-disable-next-line no-unused-vars
  const onCancel = useAction(cancelTestJob);
  const readAllJobResult = useAction(readAllResult);

  const [resultIds, setResultIds] = useState([]);
  const [resultTotal, setResultTotal] = useState(0);
  const [resultCurrent, setResultCurrent] = useState(0);
  const [resultSize, setResultSize] = useState(0);

  const {
    tableHeader,
    pagination,
    data,
    // eslint-disable-next-line no-unused-vars
    openEditor,
    // eslint-disable-next-line no-unused-vars
    reload,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    // createButton: {
    //   text: '创建测试集',
    // },
    // creator: {
    //   title: '创建测试集',
    //   onSubmit: onCreate,
    //   fields: getFields,
    //   component: Modal,
    // },
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
    // eslint-disable-next-line no-unused-vars
    reset: resultReset,
  } = useAPITable({
    paginationInitialData: {
      ids: resultIds,
      total: resultTotal,
      current: resultCurrent,
      size: resultSize,
    },
    getDataSource: (state) => flow(
      map((id) => getEntity(`testJob.${id}`)(state)),
      remove((o) => o === undefined),
    ),
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllJobResult({
        ...values,
        page: values.page + 1,
        pageSize: values.size,
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

  return (
    <Layout>
      {tableHeader}
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
        })}
        rowKey="id"
        pagination={pagination}
      />
      {resultItem && (
        <Modal
          visible={resultVisible}
          destroyOnClose
          onCancel={() => {
            closeResult();
            // suiteReset();
          }}
          footer={null}
          title={`测试任务${resultItem.id}结果查看`}
          width={1000}
        >
          {resultTableHeader}
          <Table
            // tableLayout="fixed"
            dataSource={resultData}
            columns={resultColumns()}
            rowKey="id"
            size="small"
            pagination={resultPagination}
          />
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
