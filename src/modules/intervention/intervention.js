import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map, filter, head, at, flatten, difference } from 'lodash/fp';
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

  const [skillSelect, setSkillSelect] = useState([{}]);
  const [intentSelect, setIntentSelect] = useState([{}]);
  const [slotSelect, setSlotSelect] = useState([{}]);

  const creatorFields = (form) => {
    // eslint-disable-next-line no-console
    console.log(form);

    const productSelect = () => map((item) => ({
      ...item,
      label: item.name,
      value: item.id,
    }))(products);

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
      shouldUpdate: (prevValues, curValues) => {
        if (prevValues.productId !== curValues.productId) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          curValues.skillId = '';
        }
        const skillIds = flow( // array
          filter((item) => item.id === curValues.productId),
          head,
          at('skillIds'),
          flatten,
        )(products);
        setSkillSelect(flow( // array
          map((item) => (item.skillVersions)),
          flatten,
          map((item) => ({ label: item.name, value: item.id, version: item.version })),
          filter((item) => difference(skillIds, [item.value]).length === skillIds.length - 1),
        )(skills));
        return prevValues.productId !== curValues.productId;
      },
    }, {
      label: '意图',
      name: 'intentId',
      component: Select,
      options: intentSelect,
      rules: [{ required: true }],
      shouldUpdate: (prevValues, curValues) => {
        if (prevValues.skillId !== curValues.skillId) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          curValues.intentId = '';
        }
        // console.log(intents)
        setIntentSelect(flow(
          filter((item) => item.skillId === curValues.skillId),
          map((item) => ({ label: item.name, value: item.id })),
        )(intents));
        return prevValues.productId !== curValues.productId;
      },
    }, {
      label: '插槽',
      name: 'slotId',
      component: Select,
      options: slotSelect,
      rules: [{ required: true }],
      shouldUpdate: (prevValues, curValues) => {
        if (prevValues.intentId !== curValues.intentId) {
          /* eslint no-param-reassign: ["error", { "props": false }] */
          curValues.slotId = '';
        }
        setSlotSelect(flow( // 字符串数组怎么改select option？
          filter((item) => item.skillId === curValues.skillId),
          map((item) => item.slots),
        )(intents));
        return prevValues.intentId !== curValues.intentId;
      },
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
      onCancel: () => {
        setSkillSelect([{}]);
        setIntentSelect([{}]);
      },
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
