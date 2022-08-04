import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Table,
  Select,
  Form,
} from 'antd';
import { useAPITable } from 'relient-admin/hooks';
import { readAll, create, update, remove } from 'shared/actions/testCase';
import { useAction } from 'relient/actions';
import { getEntity } from 'relient/selectors';
import { filter, map, propEq, find, flow, get } from 'lodash/fp';
import moment from 'moment';
import { useSelector } from 'react-redux';
import columns from './test-case-columns';
import selector from './test-case-selector';

const getDataSource = (state) => map((id) => getEntity(`testCase.${id}`)(state));

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const [creatorForm] = Form.useForm();
  const readAllTestCase = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  const [intentOption, setIntentOption] = useState([]);
  const [ruleOption, setRuleOption] = useState([]);

  const {
    skills,
    intents,
    rules,
  } = useSelector(selector);

  const getFields = (form) => [{
    label: '音频文件',
    name: 'audioFile',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: '描述',
    name: 'description',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
  }, {
    label: 'joss共享地址',
    name: 'jossShareUrl',
    type: 'text',
    autoComplete: 'off',
    rules: [{ required: true }],
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
      setRuleOption(filter(
        propEq('intentId', flow(
          find(propEq('value', form.getFieldValue('expectedIntentTemp'))),
          get('key'),
        )(filter(
          propEq('skillId', flow(
            find(propEq('value', form.getFieldValue('skillCode'))),
            get('key'),
          )(skills)),
        )(intents))),
      )(rules));
    },
  }, {
    label: '期待说法',
    name: 'expectedRuleTemp',
    component: Select,
    // mode: 'tags',
    options: ruleOption,
    dependencies: ['expectedIntent'],
    rules: [{ required: true }],
    onChange: () => {
      form.setFieldsValue({
        expectedRule: flow(
          find(propEq('value', form.getFieldValue('expectedRuleTemp'))),
          get('label'),
        )(ruleOption),
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
  }, { // 因为后端数据很多name同名的数据，此处又要求传name，于是设置多个隐藏的input传值
    name: 'expectedRule',
    dependencies: ['skillCode', 'expectedRuleTemp'],
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
    reset,
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
      form: creatorForm,
      onCancel: () => {
        setIntentOption([]);
        setRuleOption([]);
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
        // tableLayout="fixed"
        dataSource={data}
        columns={columns({
          openEditor,
          onRemove,
          // skills,
          reset,
        })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
