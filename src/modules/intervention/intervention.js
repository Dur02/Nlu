import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map } from 'lodash/fp';
import selector from './intervention-selector';
import columns from './intervention-columns';
import InterventionForm from './componets/intervention-form';

const result = () => {
  const {
    intervention,
    skills,
    products,
    intents,
  } = useSelector(selector);

  const onCreate = useAction(create);
  // eslint-disable-next-line no-unused-vars
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  const {
    detailsVisible: editorVisible,
    openDetails: openEditor,
    closeDetails: closeEditor,
    detailsItem: editorItem,
  } = useDetails();

  // eslint-disable-next-line no-unused-vars
  const [skillSelect, setSkillSelect] = useState(flow(
    map((item) => ({ ...item, label: item.name, value: item.id })),
  )(skills));

  // eslint-disable-next-line no-unused-vars
  const [intentSelect, setIntentSelect] = useState(flow(
    map((item) => ({ ...item, label: item.name, value: item.id })),
  )(intents));

  // eslint-disable-next-line no-unused-vars
  const creatorFields = (form) => {
    const productSelect = () => flow(
      map((item) => ({ ...item, label: item.name, value: item.id })),
    )(products);

    const a = [{
      label: '产品',
      name: 'productId',
      component: Select,
      options: productSelect(),
      rules: [{ required: true }],
    }, {
      label: '技能',
      name: 'skillId',
      component: Select,
      options: skillSelect,
      rules: [{ required: true }],
    }, {
      label: '意图',
      name: 'intentId',
      component: Select,
      options: intentSelect,
      rules: [{ required: true }],
    }, {
      label: '说法',
      name: 'sentence',
      type: 'text',
      autoComplete: 'off',
      rules: [{ required: true }],
    }, {
      label: '回复',
      name: 'response',
      type: 'text',
      autoComplete: 'off',
      rules: [{ required: true }],
    }, {
      label: '左模糊匹配',
      name: 'wildLeft',
      component: Switch,
      valuePropName: 'checked',
    }, {
      label: '右模糊匹配',
      name: 'wildRight',
      component: Switch,
      valuePropName: 'checked',
    }, {
      label: '类型',
      name: 'type',
      component: Radio.Group,
      options: [{
        label: 'DM',
        value: 1,
      }, {
        label: 'NLU',
        value: 2,
      }],
    }];
    return a;
  };

  const {
    tableHeader,
    // getDataSource,
    pagination,
    // openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'sentence',
        label: '说法',
      }, {
        dataKey: 'productId',
        label: '产品',
      }, {
        dataKey: 'skillId',
        label: '技能',
      }, {
        dataKey: 'type',
        label: '类型',
      }],
    },
    showReset: true,
    createButton: {
      text: '创建干预',
    },
    creator: {
      title: '创建干预',
      onSubmit: onCreate,
      getFields: creatorFields,
      initialValues: {
        type: 1,
      },
      component: Modal,
    },
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={intervention}
        columns={columns({ skills, products, onRemove, openEditor })}
        rowKey="id"
        pagination={pagination}
      />
      {editorItem && (
        <InterventionForm
          editorVisible={editorVisible}
          closeEditor={closeEditor}
          editorItem={editorItem}
          products={products}
          skillSelect={skillSelect}
          intentSelect={intentSelect}
        />
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
