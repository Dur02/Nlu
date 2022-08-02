import React from 'react';
import Layout from 'shared/components/layout';
import {
  Table,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll } from 'shared/actions/testSuite';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { map } from 'lodash/fp';
import moment from 'moment';
import columns from './test-suite-columns';

const getDataSource = (state) => map((id) => getEntity(`testJob.${id}`)(state));

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllTestSuite = useAction(readAll);

  const {
    tableHeader,
    pagination,
    data,
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
        columns={columns()}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
