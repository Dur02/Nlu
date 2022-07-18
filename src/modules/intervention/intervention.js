import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map, filter, head, at, flatten, difference } from 'lodash/fp';
import selector from './intervention-selector';
import columns from './intervention-columns';
// import InterventionForm from './componets/intervention-form';

const result = () => {
  const {
    intervention,
    skills,
    productVersion,
    intents,
  } = useSelector(selector);

  const onCreate = useAction(create);
  // eslint-disable-next-line no-unused-vars
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  // const {
  //   detailsVisible: editorVisible,
  //   openDetails: openEditor,
  //   closeDetails: closeEditor,
  //   detailsItem: editorItem,
  // } = useDetails();

  const [skillSelect, setSkillSelect] = useState();
  const [intentSelect, setIntentSelect] = useState();
  const [slotSelect, setSlotSelect] = useState();

  const creatorFields = (form) => {
    const productSelect = () => flow(
      map((item) => ({
        ...item,
        label: `${item.versionName}(${item.id})`,
        value: item.id,
      })),
      filter((item) => (item.pubState === 1)),
    )(productVersion);

    const array = [{
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
          form.setFieldsValue({ skillId: '' });
        }
        // console.log(productSelect());
        // console.log(skills);
        const skillIds = flow( // array
          filter((item) => item.id === curValues.productId),
          head,
          at('skillIds'),
          flatten,
        )(productVersion);
        // console.log(skillIds);
        // console.log(flow( // array
        //   map((item) => (item.skillVersions)),
        //   flatten,
        //   map((item) => ({ label: item.name, value: item.id, version: item.version })),
        //   filter((item) => difference(skillIds, [item.value]).length === skillIds.length - 1),
        // )(skills));
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
          form.setFieldsValue({ intentId: '' });
        }
        setIntentSelect(flow(
          filter((item) => item.skillId === curValues.skillId),
          map((item) => ({ label: item.name, value: item.id })),
        )(intents));
        return prevValues.productId !== curValues.productId;
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
    }, {
      label: '插槽',
      name: ['slots', 'name'],
      component: Select,
      disabled: form.getFieldValue('type') !== 2,
      options: slotSelect,
      shouldUpdate: (prevValues, curValues) => {
        // eslint-disable-next-line no-console
        console.log(form.getFieldsValue());
        if ((prevValues.intentId !== curValues.intentId) || (prevValues.type !== curValues.type)) {
          form.setFieldsValue({ slotName: '' });
        }
        setSlotSelect(flow(
          filter((item) => (item.id === curValues.intentId)),
          map((item) => JSON.parse(item.slots)),
          flatten,
          map((item) => ({ ...item, label: item.name, value: item.name })),
        )(intents));
        return prevValues.intentId !== curValues.intentId || prevValues.type !== curValues.type;
      },
    }, {
      label: '插槽值',
      name: ['slots', 'value'],
      type: 'text',
      autoComplete: 'off',
      disabled: form.getFieldValue('type') !== 2,
    }];
    return array;
  };

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'sentence',
        label: '说法',
      }, {
        dataKey: 'productId',
        label: '产品',
      }, {
        dataKey: 'skillCode',
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
        wildLeft: false,
        wildRight: false,
        type: 1,
      },
      component: Modal,
    },
    editor: {
      title: '编辑产品',
      onSubmit: onUpdate,
      getFields: creatorFields,
      component: Modal,
    },
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(intervention)}
        columns={columns({ skills, productVersion, onRemove, openEditor })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
