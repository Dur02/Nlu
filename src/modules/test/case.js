import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Table,
  Select,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll, create, update, remove as removeTestCase } from 'shared/actions/test-case';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { filter, map, propEq, find, flow, get, remove } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import columns from './test-case-columns';
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
}) => {
  const readAllTestCase = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(removeTestCase);

  const [intentOption, setIntentOption] = useState([]);

  const {
    skills,
    intents,
    rules,
  } = useSelector(selector);

  const getFields = (form) => [{
    label: 'joss共享地址',
    name: 'jossShareUrl',
    type: 'text',
    autoComplete: 'off',
  }, {
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
    showSearch: true,
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
        expectedRule: '',
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
    showSearch: true,
    allowClear: true,
    dependencies: ['skillCode'],
    rules: [{ required: true }],
    onChange: () => {
      form.setFieldsValue({
        expectedRuleTemp: [],
        expectedIntent: flow(
          find(propEq('value', form.getFieldValue('expectedIntentTemp'))),
          get('label'),
        )(intentOption),
      });
    },
  }, {
    name: 'expectedSkill',
    dependencies: ['skillCode'],
    type: 'text',
    autoComplete: 'off',
    style: {
      display: 'none',
    },
  }, { // 因为后端数据很多name同名的数据，此处又要求传name，于是设置多个隐藏的input传值
    name: 'expectedIntent',
    dependencies: ['skillCode', 'expectedIntentTemp'],
    type: 'text',
    autoComplete: 'off',
    style: {
      display: 'none',
    },
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
    },
    editor: {
      title: '编辑',
      onSubmit: onUpdate,
      getFields,
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
          openEditor,
          onRemove,
          // skills,
          reload,
          pagination,
          setIntentOption,
          skills,
          intents,
          rules,
        })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
