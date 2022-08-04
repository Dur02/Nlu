import React from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Radio,
  Table,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestSuite } from 'shared/actions/test-suite';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { suiteType, normalTest } from 'shared/constants/test-suite';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { flow, map, remove } from 'lodash/fp';
import moment from 'moment';
import columns from './test-suite-columns';

const getDataSource = (state) => flow(
  map((id) => getEntity(`testJob.${id}`)(state)),
  remove((o) => o === undefined),
);

// eslint-disable-next-line no-unused-vars
const getFields = (form) => [{
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
}, {
  label: '包含测试示例',
  name: 'testCaseIds',
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
  const readAllTestSuite = useAction(readAll);
  const onCreate = useAction(create);
  // eslint-disable-next-line no-unused-vars
  const onUpdate = useAction(update);
  // eslint-disable-next-line no-unused-vars
  const onRemove = useAction(removeTestSuite);
  // eslint-disable-next-line no-unused-vars
  const readAllTestCase = useAction(readTestCase);

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
    creator: {
      title: '创建测试集',
      onSubmit: onCreate,
      getFields,
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
