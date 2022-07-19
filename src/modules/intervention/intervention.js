import React, { useCallback, useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
// eslint-disable-next-line no-unused-vars
import { Table, Modal, Select, Switch, Radio, Button, Form, Input } from 'antd';
// eslint-disable-next-line no-unused-vars
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map, filter, head, at, flatten, prop } from 'lodash/fp';
import { productBindSkill } from 'shared/actions/product';
import selector from './intervention-selector';
import columns from './intervention-columns';
// import InterventionForm from './componets/intervention-form';

const result = () => {
  const {
    intervention,
    skills,
    products,
    productVersion,
  } = useSelector(selector);

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);
  const readAllSelect = useAction(productBindSkill);

  // const {
  //   detailsVisible: editorVisible,
  //   openDetails: openEditor,
  //   closeDetails: closeEditor,
  //   detailsItem: editorItem,
  // } = useDetails();

  const [skillOption, setSkillOption] = useState();
  const [allIntent, setAllIntentMb] = useState();
  const [intentOption, setIntentOption] = useState();
  const [visible, setVisible] = useState('none');

  const productIdChange = useCallback(async (productId) => {
    const { data } = await readAllSelect({ productId, status: 1 });
    setSkillOption(flow(
      map((item) => ({ ...item, label: item.name, value: item.id })),
    )(data.skills));
    setAllIntentMb(flow(
      map((item) => ({ [item.id]: item.intents })),
    )(data.skills));
  }, [setSkillOption, setAllIntentMb]);

  const skillIdChange = useCallback(async (skillId) => {
    setIntentOption(flow(
      filter((i) => (prop(`${skillId}`)(i))),
      head,
      at(`${skillId}`),
      flatten,
      map((item) => ({ ...item, label: item.name, value: item.id })),
    )(allIntent));
  }, [allIntent, intentOption, setIntentOption]);

  const creatorFields = (form) => {
    const array = [{
      label: '产品',
      name: 'productId',
      component: Select,
      options: flow(
        map((item) => ({
          ...item,
          label: flow(
            filter((i) => (i.id === item.productId)),
            head,
            at('name'),
            head,
          )(products),
          value: item.productId,
        })),
        filter((item) => (item.pubState === 1)),
        filter((i) => (i.label !== undefined)),
      )(productVersion),
      rules: [{ required: true }],
      onChange: productIdChange,
    }, {
      label: '技能',
      name: 'skillId',
      component: Select,
      options: skillOption,
      rules: [{ required: true }],
      onChange: skillIdChange,
      shouldUpdate: async (prevValues, curValues) => {
        if (prevValues.productId !== curValues.productId) {
          form.setFieldsValue({ skillId: '' });
        }
        return prevValues.productId !== curValues.productId;
      },
    }, {
      label: '意图',
      name: 'intentId',
      component: Select,
      options: intentOption,
      rules: [{ required: true }],
      shouldUpdate: (prevValues, curValues) => {
        if (prevValues.skillId !== curValues.skillId) {
          form.setFieldsValue({ intentId: '' });
        }
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
      name: 'slots',
      isArray: true,
      fields: [{
        label: '技能',
        name: 'skillId',
        component: Select,
        options: skillOption,
        rules: [{ required: true }],
        onChange: skillIdChange,
        shouldUpdate: async (prevValues, curValues) => {
          if (prevValues.productId !== curValues.productId) {
            form.setFieldsValue({ skillId: '' });
          }
          return prevValues.productId !== curValues.productId;
        },
      }, {
        label: '回复',
        name: 'response',
        type: 'text',
        autoComplete: 'off',
        rules: [{ required: true }],
      }],
    }, {
      name: 'add',
      element: (
        <Button
          type="dashed"
          style={{
            position: 'absolute',
            left: '80%',
            display: visible,
          }}
          key="12"
        >Add
        </Button>
      ),
      shouldUpdate: (prevValues, curValues) => {
        // eslint-disable-next-line no-unused-expressions
        curValues.type === 2 ? setVisible('block') : setVisible('none');
        return prevValues.type !== curValues.type;
      },
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
        setSkillOption();
        setAllIntentMb();
        setIntentOption();
        setVisible('none');
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
