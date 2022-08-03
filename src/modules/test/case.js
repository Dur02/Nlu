import React from 'react';
import Layout from 'shared/components/layout';
import {
  Modal,
  Table,
  Select,
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
  const readAllTestCase = useAction(readAll);
  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  const {
    skills,
    intents,
    rules,
  } = useSelector(selector);

  const getFields = (form) => {
    const baseFields = [{
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
      name: 'expectedSkill',
      component: Select,
      options: skills,
      rules: [{ required: true }],
      onChange: () => {
        form.setFieldsValue({
          expectedIntent: null,
          expectedRule: null,
          skillCode: flow(
            find(propEq('value', form.getFieldValue('expectedSkill'))),
            get('skillCode'),
          )(skills),
        });
      },
    }, {
      label: '期待意图',
      name: 'expectedIntent',
      component: Select,
      options: filter(propEq('skillId', form.getFieldValue('expectedSkill')))(intents),
      dependencies: ['expectedSkill'],
      rules: [{ required: true }],
      onChange: () => {
        form.setFieldsValue({ expectedRule: null });
      },
    }, {
      label: '期待规则',
      name: 'expectedRule',
      component: Select,
      options: filter(propEq('intentId', form.getFieldValue('expectedIntent')))(rules),
      dependencies: ['expectedIntent'],
      rules: [{ required: true }],
    }, {
      name: 'skillCode',
      dependencies: ['expectedSkill'],
      style: {
        display: 'none',
      },
    }];
    return baseFields;
  };

  const {
    tableHeader,
    pagination,
    data,
    openEditor,
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
        })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
