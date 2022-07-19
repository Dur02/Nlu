/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import Layout from 'shared/components/layout';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
import { Table, Modal, Select, Switch, Radio, Button, Form, Input } from 'antd';
import { useAction } from 'relient/actions';
import { remove, create, update } from 'shared/actions/intervention';
import { flow, map, filter, propEq, prop } from 'lodash/fp';
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
    intents,
  } = useSelector(selector);

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);
  const readSkillVersionsByProduct = useAction(readSkillVersionsByProductAction);

  const [loading, setLoading] = useState(false);

  const getFields = (form) => {
    const productId = form.getFieldValue('productId');
    const skillId = form.getFieldValue('skillId');
    const skillOptions = flow(
      prop([productId, 'skillIds']),
      map((id) => prop(id)(skillVersionEntity)),
      filter(propEq('pubState', 1)),
      map((name, id) => ({
        value: id,
        label: name,
      })),
    )(productEntity);
    const intentOptions = flow(
      filter(propEq('skillId', skillId)),
      map((name, id) => ({
        value: id,
        label: name,
      })),
    )(intents);

    return [{
      label: '产品',
      name: 'productId',
      component: Select,
      options: productOptions,
      rules: [{ required: true }],
      onChange: async (value) => {
        setLoading(true);
        await readSkillVersionsByProduct({ productId: value, status: 1 });
        setLoading(false);
        form.setFieldsValue({ skillId: null, intentId: null, slots: [] });
      },
    }, {
      label: '技能',
      name: 'skillId',
      component: Select,
      options: skillOptions,
      rules: [{ required: true }],
      onChange: async () => {
        form.setFieldsValue({ intentId: null, slots: [] });
      },
      loading,
    }, {
      label: '意图',
      name: 'intentId',
      component: Select,
      options: intentOptions,
      rules: [{ required: true }],
      shouldUpdate: (prevValues, curValues) => prevValues.skillId !== curValues.skillId,
      onChange: async () => {
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
                name={[name, 'skillId']}
                rules={[{ required: true }]}
              >
                <Select options={skillOptions} placeholder="技能" />
              </Item>
              <Item
                {...restField}
                name={[name, 'response']}
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
              添加
            </Button>
          </Item>
        </>
      ),
    }];
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
      onSubmit: onCreate,
      getFields,
      initialValues: {
        wildLeft: false,
        wildRight: false,
        type: 1,
        slots: [{
          skillId: null,
          response: '',
        }],
      },
      component: Modal,
    },
    editor: {
      title: '编辑产品',
      onSubmit: onUpdate,
      getFields,
      component: Modal,
    },
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(intervention)}
        columns={columns({ skillVersionEntity, onRemove, openEditor })}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
