import React from 'react';
import Layout from 'shared/components/layout';
import {
  Table,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll } from 'shared/actions/test-case';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { map, flow, remove } from 'lodash/fp';
import moment from 'moment';
import { columns } from './test-case-columns';

const getDataSource = (state) => flow(
  map((id) => getEntity(`testCase.${id}`)(state)),
  remove((o) => o === undefined),
);

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllTestCase = useAction(readAll);

  const {
    tableHeader,
    pagination,
    data,
    // openEditor,
    // reload,
  } = useAPITable({
    paginationInitialData: {
      ids,
      total,
      current,
      size,
    },
    getDataSource,
    readAction: async (values) => {
      // console.log(data);
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
      }, {
        dataKey: 'intentName',
        label: '意图名',
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
