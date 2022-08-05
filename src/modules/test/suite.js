import React from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Radio,
  Table,
} from 'antd';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestSuite, caseAdd, caseDel } from 'shared/actions/test-suite';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { suiteType, normalTest } from 'shared/constants/test-suite';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { flow, map, remove } from 'lodash/fp';
import moment from 'moment';
import { columns } from './test-suite-columns';
import { testCaseColumns } from './test-case-columns';

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
  const readAllTestSuite = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(removeTestSuite);
  const readAllTestCase = useAction(readTestCase);
  const addCaseToSuite = useAction(caseAdd);
  const delCaseFromSuite = useAction(caseDel);

  const {
    detailsVisible: caseTableVisible,
    openDetails: openCaseTable,
    closeDetails: closeCaseTable,
    detailsItem: caseTableItem,
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

  const {
    tableHeader: caseTableHeader,
    pagination: casePagination,
    data: caseData,
    // reload: caseReload,
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
          }}
          footer={null}
          title={`测试集${caseTableItem.id}修改`}
          width={1100}
          zIndex={9}
        >
          {caseTableHeader}
          <Table
            // tableLayout="fixed"
            dataSource={caseData}
            columns={testCaseColumns({
              caseTableItem,
              addCaseToSuite,
              delCaseFromSuite,
            })}
            rowKey="id"
            size="small"
            pagination={casePagination}
          />
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
