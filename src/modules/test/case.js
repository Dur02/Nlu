import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Table,
  Select,
  Button,
} from 'antd';
import { useAPITable, useDetails } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestCase } from 'shared/actions/test-case';
import { readAll as readTestSuite, caseAdd, caseDel } from 'shared/actions/test-suite';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { filter, map, propEq, find, flow, get, remove, union, prop, includes } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import { columns } from './test-case-columns';
import { testSuiteColumns } from './test-suite-columns';
import selector from './test-case-selector';

const getDataSource = (state) => flow(
  map((id) => getEntity(`testCase.${id}`)(state)),
  remove((o) => o === undefined),
);

const result = ({
  ids,
  total,
  current,
  size,
  suiteIds,
  suiteTotal,
  suiteCurrent,
  suiteSize,
}) => {
  const {
    skills,
    intents,
  } = useSelector(selector);

  const readAllTestCase = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(removeTestCase);
  const readAllTestSuite = useAction(readTestSuite);
  const addCaseToSuite = useAction(caseAdd);
  const delCaseFromSuite = useAction(caseDel);

  const [intentOption, setIntentOption] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const {
    detailsVisible: bindVisible,
    openDetails: openBind,
    closeDetails: closeBind,
    detailsItem: bindItem,
  } = useDetails();

  const getFields = (form) => [{
    label: '用户说',
    name: 'refText',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: '期待技能',
    // 因为技能可同名，在此处传skillCode而在下面传expectedSkill，并非写错
    name: 'skillCode',
    component: Select,
    options: skills,
    allowClear: true,
    rules: [{ required: true }],
    onChange: () => {
      form.setFieldsValue({
        expectedIntentTemp: '',
        expectedRuleTemp: [],
        expectedSkill: flow(
          find(propEq('value', form.getFieldValue('skillCode'))),
          get('label'),
        )(skills),
        expectedIntent: '',
        skillName: flow(
          find(propEq('value', form.getFieldValue('skillCode'))),
          get('label'),
        )(skills),
      });
      setIntentOption(filter(
        propEq('skillId', flow(
          find(propEq('skillCode', form.getFieldValue('skillCode'))),
          get('key'),
        )(skills)),
      )(intents));
    },
  }, {
    label: '期待意图',
    name: 'expectedIntentTemp',
    component: Select,
    options: intentOption,
    allowClear: true,
    dependencies: ['skillCode'],
    rules: [{ required: true }],
    onChange: () => {
      form.setFieldsValue({
        expectedIntent: flow(
          find(propEq('value', form.getFieldValue('expectedIntentTemp'))),
          get('label'),
        )(intentOption),
        intentName: flow(
          find(propEq('value', form.getFieldValue('expectedIntentTemp'))),
          get('label'),
        )(intentOption),
      });
    },
  }, {
    label: 'joss共享地址',
    name: 'jossShareUrl',
    type: 'text',
    autoComplete: 'off',
  }, {
    name: 'expectedSkill',
    dependencies: ['skillCode'],
    type: 'text',
    autoComplete: 'off',
    hidden: true,
  }, {
    // 因为后端数据很多name同名的数据，此处又要求传name，于是设置多个隐藏的input传值
    name: 'expectedIntent',
    dependencies: ['skillCode', 'expectedIntentTemp'],
    type: 'text',
    autoComplete: 'off',
    hidden: true,
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
      text: '创建用例',
    },
    creator: {
      title: '创建用例',
      onSubmit: onCreate,
      getFields,
      onCancel: () => {
        setIntentOption([]);
      },
      component: Modal,
      zIndex: '99',
    },
    editor: {
      title: '编辑',
      onSubmit: onUpdate,
      getFields,
      onCancel: () => {
        setIntentOption([]);
      },
      component: Modal,
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

  const {
    tableHeader: suiteTableHeader,
    pagination: suitePagination,
    data: suiteData,
    reset: suiteReset,
  } = useAPITable({
    paginationInitialData: {
      ids: suiteIds,
      total: suiteTotal,
      current: suiteCurrent,
      size: suiteSize,
    },
    getDataSource: (state) => flow(
      map((id) => getEntity(`testSuite.${id}`)(state)),
      remove((o) => o === undefined),
    ),
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
        label: '测试集名',
      }],
      searchWhenValueChange: false,
    },
    datePickers: [{
      dataKey: 'createTime',
      label: '起止日期',
      disabledDate: (date) => date.isAfter(new Date()),
    }],
  });

  const rowSelection = {
    selectedRowKeys,
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

  return (
    <Layout>
      {tableHeader}
      <Button
        icon={<UploadOutlined />}
        type="primary"
        // loading={isUploading}
        // onClick={openImportModal}
        size="large"
        style={{
          position: 'absolute',
          top: 24,
          left: 140,
        }}
      >
        导入
      </Button>
      {
        selectedRowKeys.length !== 0 ? (
          <Button
            type="danger"
            ghost
            // loading={isUploading}
            // onClick={openImportModal}
            size="large"
            style={{
              position: 'absolute',
              top: 24,
              left: 246,
            }}
          >
            批量删除
          </Button>
        ) : null
      }
      <Table
        // tableLayout="fixed"
        dataSource={data}
        columns={columns({
          openEditor,
          onRemove,
          reload,
          pagination,
          setIntentOption,
          skills,
          intents,
          openBind,
          readAllTestSuite,
        })}
        rowKey="id"
        pagination={pagination}
        rowSelection={rowSelection}
      />
      {bindItem && (
        <Modal
          visible={bindVisible}
          destroyOnClose
          onCancel={() => {
            closeBind();
            suiteReset();
          }}
          footer={null}
          title={`测试用例${bindItem.id}添加`}
          width={1000}
          zIndex={9}
        >
          {suiteTableHeader}
          <Table
            // tableLayout="fixed"
            dataSource={suiteData}
            columns={testSuiteColumns({
              bindItem,
              addCaseToSuite,
              delCaseFromSuite,
            })}
            rowKey="id"
            size="small"
            pagination={suitePagination}
          />
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
