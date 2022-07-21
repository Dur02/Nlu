/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio, Button, Form, Input } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map, propEq, prop, find } from 'lodash/fp';
import { readByProduct as readSkillVersionsByProductAction } from 'shared/actions/skill-version';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import selector from './intervention-selector';
import columns from './intervention-columns';

const { Item } = Form;
const wrapperCol = { span: 14 };
const labelCol = { span: 8 };
const mapWithIndex = map.convert({ cap: false });

const result = () => {
  const {
    intervention,
    productOptions,
    productEntity,
    skillVersionEntity,
    // intents,
  } = useSelector(selector);

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);
  const readSkillVersionsByProduct = useAction(readSkillVersionsByProductAction);

  const [loading, setLoading] = useState(false);
  const [skillState, setSkillsState] = useState();
  const [typeState, setTypeState] = useState(1);

  const slotsSelect = (form) => {
    const slots = flow(
      find(propEq('value', form.getFieldValue('skillId'))),
      prop('intents'),
      map((item) => ({ slots: item.slots, value: item.id })),
      find(propEq('value', form.getFieldValue('intentId'))),
      prop('slots'),
    )(skillState);
    if (form.getFieldValue('intentId') !== null && form.getFieldValue('skillId') !== null && slots !== undefined) {
      return (map((item) => ({ label: item.name, value: item.name }))(JSON.parse(slots)));
    }
    return [];
  };

  const cretorField = (form) => [{
    label: '产品',
    name: 'productId',
    component: Select,
    options: productOptions,
    rules: [{ required: true }],
    onChange: async (value) => {
      setLoading(true);
      const { data } = await readSkillVersionsByProduct({ productId: value, status: 1 });
      setSkillsState(map(({ intents, name, id }) => ({
        intents,
        label: name,
        value: id,
      }))(data.skills));
      setLoading(false);
      form.setFieldsValue({ skillId: null, intentId: null, slots: [] });
    },
  }, {
    label: '技能',
    name: 'skillId',
    component: Select,
    options: skillState,
    rules: [{ required: true }],
    onChange: () => {
      form.setFieldsValue({ intentId: null, slots: [] });
    },
    loading,
  }, {
    label: '意图',
    name: 'intentId',
    component: Select,
    options: flow(
      find(propEq('value', form.getFieldValue('skillId'))),
      prop('intents'),
      map((item) => ({ label: item.name, value: item.id })),
    )(skillState),
    rules: [{ required: true }],
    dependencies: ['skillId'],
    onChange: () => {
      form.setFieldsValue({ slots: [] });
    },
    loading,
  }, {
    label: '说法',
    name: 'sentence',
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
    onChange: (value) => {
      setTypeState(value);
    },
  }, {
    name: typeState === 2 ? 'slots' : 'response',
    children: (fields, operation) => {
      if (typeState === 2) {
        return (
          <>
            {mapWithIndex(({ key, name, ...restField }, index) => (
              <Item
                key={key}
                label={index === 0 ? '语义槽' : ' '}
                colon={index === 0}
                labelCol={labelCol}
                wrapperCol={wrapperCol}
              >
                <Item
                  {...restField}
                  name={[name, 'name']}
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="技能"
                    options={slotsSelect(form)}
                  />
                </Item>
                <Item
                  {...restField}
                  name={[name, 'value']}
                  rules={[{ required: true }]}
                >
                  <Input autoComplete="off" placeholder="回复" />
                </Item>
                <MinusCircleOutlined
                  style={{ position: 'absolute', top: 4, right: -30, fontSize: 20 }}
                  onClick={() => operation.remove(name)}
                />
              </Item>
            ))(fields)}
            <Item wrapperCol={{ ...wrapperCol, offset: labelCol.span }}>
              <Button
                type="dashed"
                onClick={() => operation.add()}
                block
                icon={<PlusOutlined />}
              >
                添加语义槽
              </Button>
            </Item>
          </>
        );
      }
      return (
        <Item
          name="response"
          label="回复"
          labelCol={labelCol}
          wrapperCol={wrapperCol}
          rules={[{ required: true }]}
        >
          <Input autoComplete="off" placeholder="回复" />
        </Item>
      );
    },
  }];

  // const editorField = (form) => [{
  //   label: '说法',
  //   name: 'sentence',
  //   type: 'text',
  //   autoComplete: 'off',
  //   rules: [{ required: true }],
  // }, {
  //   label: '左模糊匹配',
  //   name: 'wildLeft',
  //   component: Switch,
  //   valuePropName: 'checked',
  // }, {
  //   label: '右模糊匹配',
  //   name: 'wildRight',
  //   component: Switch,
  //   valuePropName: 'checked',
  // }, {
  //   label: '类型',
  //   name: 'type',
  //   component: Radio.Group,
  //   options: [{
  //     label: 'DM',
  //     value: 1,
  //   }, {
  //     label: 'NLU',
  //     value: 2,
  //   }],
  //   onChange: () => {
  //     if (form.getFieldValue('type') === 1) {
  //       // eslint-disable-next-line no-console
  //       console.log('隐藏语音槽');
  //     } else {
  //       // eslint-disable-next-line no-console
  //       console.log('隐藏回复');
  //     }
  //   },
  // }, {
  //   name: form.getFieldValue('type') === 2 ? 'slots' : 'response',
  //   children: (fields, operation) => {
  //     if (form.getFieldValue('type') === 2) {
  //       return (
  //         <>
  //           {mapWithIndex(({ key, name, ...restField }, index) => (
  //             <Item
  //               key={key}
  //               label={index === 0 ? '语义槽' : ' '}
  //               colon={index === 0}
  //               labelCol={labelCol}
  //               wrapperCol={wrapperCol}
  // eslint-disable-next-line max-len
  //               shouldUpdate={async (prevValues, curValues) => prevValues.type !== curValues.type}
  //             >
  //               <Item
  //                 {...restField}
  //                 name={[name, 'name']}
  //                 rules={[{ required: true }]}
  //               >
  //                 <Select
  //                   placeholder="技能"
  //                   options={slotsSelect(form)}
  //                 />
  //               </Item>
  //               <Item
  //                 {...restField}
  //                 name={[name, 'value']}
  //                 rules={[{ required: true }]}
  //               >
  //                 <Input autoComplete="off" placeholder="回复" />
  //               </Item>
  //               <MinusCircleOutlined
  //                 style={{ position: 'absolute', top: 4, right: -30, fontSize: 20 }}
  //                 onClick={() => operation.remove(name)}
  //               />
  //             </Item>
  //           ))(fields)}
  //           <Item wrapperCol={{ ...wrapperCol, offset: labelCol.span }}>
  //             <Button
  //               type="dashed"
  //               onClick={() => operation.add()}
  //               block
  //               icon={<PlusOutlined />}
  //             >
  //               添加语义槽
  //             </Button>
  //           </Item>
  //         </>
  //       );
  //     }
  //     return (
  //       <Item
  //         label="回复"
  //         labelCol={labelCol}
  //         wrapperCol={wrapperCol}
  //         shouldUpdate={async (prevValues, curValues) => prevValues.type !== curValues.type}
  //       >
  //         <Input autoComplete="off" placeholder="回复" />
  //       </Item>
  //     );
  //   },
  // }];

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
        dataKey: 'response',
        label: '回应',
      }],
    },
    showReset: true,
    createButton: {
      text: '创建干预',
    },
    creator: {
      title: '创建干预',
      onSubmit: onCreate,
      onCancel: () => {
        setSkillsState();
        setTypeState(1);
      },
      getFields: cretorField,
      initialValues: {
        skillId: null,
        intentId: null,
        wildLeft: false,
        wildRight: false,
        type: 1,
        slots: [{
          name: null,
          value: '',
        }],
      },
      component: Modal,
    },
    editor: {
      title: '编辑产品',
      onSubmit: onUpdate,
      onCancel: () => {
        setSkillsState();
        setTypeState(1);
      },
      getFields: cretorField,
      component: Modal,
    },
  });

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: 'entityName',
        dataIndex: 'entityName',
      }, {
        title: 'name',
        dataIndex: 'name',
      }, /* {
        title: 'rawvalue',
        dataIndex: 'rawvalue',
      }, */ {
        title: 'realSlot',
        dataIndex: 'realSlot',
      }, {
        title: 'value',
        dataIndex: 'value',
      }];

      return (
        <Table
          dataSource={record.slots}
          tableLayout="fixed"
          rowKey="key"
          columns={expandedColumns}
          pagination={false}
        />
      );
    },
    rowExpandable: ({ slots }) => slots,
  };

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(intervention)}
        tableLayout="fixed"
        columns={columns({
          skillVersionEntity,
          onRemove,
          openEditor,
          productEntity,
          setSkillsState,
          readSkillVersionsByProduct,
          setLoading,
          setTypeState,
        })}
        rowKey="id"
        pagination={pagination}
        expandable={expandable}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
