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
import { interventionTypeOptions, NLU, DM } from 'shared/constants/intervention-type';
import selector from './intervention-selector';
import columns from './intervention-columns';

const { Item } = Form;
const wrapperCol = { span: 14 };
const labelCol = { span: 8 };
const mapWithIndex = map.convert({ cap: false });

const getSlotOptions = (form, skills) => {
  const skillId = form.getFieldValue('skillId');
  const intentId = form.getFieldValue('intentId');
  const slots = flow(
    find(propEq('value', skillId)),
    prop('intents'),
    find(propEq('id', intentId)),
    prop('slots'),
  )(skills);
  if (intentId && skillId && slots) {
    return (map(({ name }) => ({ label: name, value: name }))(JSON.parse(slots)));
  }
  return [];
};

const result = () => {
  const {
    intervention,
    productOptions,
    productEntity,
    skillVersionEntity,
    intentEntity,
  } = useSelector(selector);

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);
  const readSkillVersionsByProduct = useAction(readSkillVersionsByProductAction);

  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState();
  const [inventionType, setInventionType] = useState(DM);

  const getFields = (form) => {
    const baseFields = [{
      label: '产品',
      name: 'productId',
      component: Select,
      options: productOptions,
      rules: [{ required: true }],
      onChange: async (value) => {
        setLoading(true);
        const { data } = await readSkillVersionsByProduct({ productId: value, status: 1 });
        setSkills(map(({ intents, name, id }) => ({
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
      options: skills,
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
      )(skills),
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
      options: interventionTypeOptions,
      onChange: ({ target: { value } }) => {
        setInventionType(value);
      },
    }];
    const slotsField = {
      name: 'slots',
      children: (fields, operation) => (
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
                  options={getSlotOptions(form, skills)}
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
      ),
    };
    const responseField = {
      name: 'response',
      label: '回复',
      rules: [{ required: true }],
      autoComplete: 'off',
      placeholder: '回复',
    };
    if (inventionType === NLU) {
      return [...baseFields, slotsField];
    }
    return [...baseFields, responseField];
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
        dataKey: 'response',
        label: '回复',
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
        setSkills();
        setInventionType(DM);
      },
      getFields,
      initialValues: {
        skillId: null,
        intentId: null,
        wildLeft: false,
        wildRight: false,
        type: DM,
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
        setSkills();
        setInventionType(DM);
      },
      getFields,
      component: Modal,
    },
    filters: [{
      dataKey: 'productId',
      label: '产品',
      defaultValue: null,
      options: [{
        label: '全部',
        value: null,
      }, ...productOptions],
    }, {
      dataKey: 'label',
      label: '状态',
      defaultValue: null,
      options: [{
        label: '全部',
        value: null,
      }, {
        label: '正常',
        value: 1,
      }, {
        label: '废弃',
        value: 2,
      }],
    }, {
      dataKey: 'type',
      label: '类型',
      defaultValue: null,
      options: [{
        label: '全部',
        value: null,
      }, {
        label: 'DM',
        value: 1,
      }, {
        label: 'NLU',
        value: 2,
      }],
    }],
  });

  const expandable = {
    expandedRowRender: (record) => {
      const expandedColumns = [{
        title: '词库名 ',
        dataIndex: 'entityName',
      }, {
        title: '槽位名',
        dataIndex: 'name',
      }, {
        title: '是否有效嘈位',
        dataIndex: 'realSlot',
      }, {
        title: '值',
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
    rowExpandable: ({ slots }) => slots && slots.length !== 0,
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
          intentEntity,
          setSkills,
          readSkillVersionsByProduct,
          setLoading,
          setInventionType,
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
