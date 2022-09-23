import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { readAll, remove as removeIntentMap, update, create } from 'shared/actions/intent-map';
import { useAction } from 'relient/actions';
import { useAPITable } from 'relient-admin/hooks';
import { flow, map, remove, prop, find, propEq, findKey } from 'lodash/fp';
import { getEntity } from 'relient/selectors';
import { useSelector } from 'react-redux';
import { Modal, Table, Select } from 'antd';
import columns from './intent-map-columns';

const getDataSource = (state) => flow(
  map((id) => getEntity(`intentMap.${id}`)(state)),
  remove((o) => o === undefined),
);

const result = ({
  ids,
  total,
  current,
  size,
}) => {
  const readAllIntentMap = useAction(readAll);
  const onRemove = useAction(removeIntentMap);
  const onUpdate = useAction(update);
  const onCreate = useAction(create);

  const [intentOption, setIntentOption] = useState([]);

  const {
    intentMapInfoOptions,
    skillInfos,
  } = useSelector((state) => ({
    intentMapInfoOptions: flow(
      getEntity('intentMapInfo'),
      prop('intentMapNames'),
      map((item) => ({
        label: item,
        value: item,
      })),
    )(state),
    skillInfos: flow(
      getEntity('intentMapInfo'),
      prop('skillInfos'),
    )(state),
  }));

  const getUpdateField = (form) => [{
    label: '技能',
    name: 'skillCode',
    component: Select,
    options: map(({ skillCode, skillName }) => ({
      label: skillName,
      value: skillCode,
    }))(skillInfos),
    rules: [{ required: true }],
    onChange: async (skillCode) => {
      const selectedSkill = flow(
        find(propEq('skillCode', skillCode)),
        prop('intentNames'),
      )(skillInfos);
      setIntentOption(
        map((item) => ({
          label: findKey((o) => o === item)(selectedSkill),
          value: findKey((o) => o === item)(selectedSkill),
        }))(selectedSkill),
      );
      form.setFieldsValue({ intentId: null });
    },
  }, {
    label: '意图',
    name: 'intentName',
    component: Select,
    options: intentOption,
    rules: [{ required: true }],
    // onChange: (intentId) => {
    // const selectedIntent = find(({ value }) => value === intentId)(intentOption);
    // form.setFieldsValue({ intentMapName: selectedIntent ? selectedIntent.label : '' });
    // },
  }];

  const getCreateField = (form) => [...getUpdateField(form), {
    label: '意图映射',
    name: 'intentMapName',
    component: Select,
    options: intentMapInfoOptions,
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
      text: '创建映射',
    },
    creator: {
      title: '创建映射',
      onSubmit: onCreate,
      getFields: getCreateField,
      component: Modal,
      onCancel: () => {
        setIntentOption([]);
      },
    },
    editor: {
      title: '更新',
      onSubmit: onUpdate,
      getFields: getUpdateField,
      component: Modal,
      onCancel: () => {
        setIntentOption([]);
      },
    },
    getDataSource,
    readAction: async (values) => {
      const {
        data: response,
      } = await readAllIntentMap({
        ...values,
        page: values.page + 1,
        pageSize: values.size,
      });
      return {
        content: response.records,
        number: response.current - 1,
        size: response.size,
        totalElements: response.total,
      };
    },
    filters: [{
      dataKey: 'intentMapName',
      label: '意图映射名',
      defaultValue: '',
      options: [{
        value: '',
        label: '全部',
      }, ...intentMapInfoOptions],
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
          pagination,
          reload,
          setIntentOption,
          skillInfos,
        })}
        rowKey="id"
        // expandable={expandable}
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
