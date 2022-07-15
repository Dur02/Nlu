import React from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
// import { flow, prop, filter, head } from 'lodash/fp';
import selector from './intervention-selector';
import columns from './intervention-columns';

const result = () => {
  const {
    intervention,
    skills,
    products,
  } = useSelector(selector);

  const productSelect = () => {
    // eslint-disable-next-line no-console
    console.log(products);
    return [{
      label: '111',
      value: '222',
    }, {
      label: '333',
      value: '444',
    }];
  };

  const onCreate = useAction(create);
  // eslint-disable-next-line no-unused-vars
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  const creatorFields = [{
    label: '产品',
    name: 'productId',
    component: Select,
    options: productSelect(products),
    rules: [{ required: true }],
  }, {
    label: '技能',
    name: 'skillId',
    component: Select,
    options: [{
      label: '111',
      value: 222,
    }],
    rules: [{ required: true }],
  }, {
    label: '意图',
    name: 'intentId',
    component: Select,
    options: [{
      label: '111',
      value: 222,
    }],
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
    defaultChecked: false,
  }, {
    label: '右模糊匹配',
    name: 'wildRight',
    component: Switch,
    defaultChecked: false,
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
      fields: creatorFields,
      // initialValues: {
      //   productId: '222',
      //   skillId: '222',
      //   intentId: 222,
      // },
      component: Modal,
    },
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={intervention}
        columns={columns({ skills, products, onRemove })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
