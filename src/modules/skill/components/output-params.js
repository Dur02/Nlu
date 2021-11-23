import React, { useCallback, useState } from 'react';
import { func, string, object } from 'prop-types';
import { Drawer, message, Table, Button, Popconfirm } from 'antd';
import { map, any, flow, prop, reject, propEq, eq } from 'lodash/fp';
import { useLocalTable } from 'relient-admin/hooks';
import useStyles from 'isomorphic-style-loader/useStyles';
import { PlainText } from 'relient-admin/components';

import s from './output-params.less';

const INTENT_NAME = 'intentName';
const WIDGET_TYPE = 'widgetType';

const hasDuplicatedName = (name) => any(flow(prop('name'), eq(name)));

const result = ({
  onChange,
  value,
  intentName,
  component,
}) => {
  useStyles(s);

  const [isEditingSlot, setIsEditingSlot] = useState(false);
  const extraParams = flow(
    prop('extra'),
    map((param) => ({ ...param, isExtra: true })),
  )(value) || [];
  const slotParams = flow(
    prop('slots'),
    map((param) => ({ ...param, isSlot: true })),
  )(value) || [];

  const onCreateParam = useCallback(
    (newParam) => {
      const { name } = newParam;
      if (hasDuplicatedName(name)([...extraParams, ...slotParams])
        || name === INTENT_NAME
        || name === WIDGET_TYPE) {
        message.error('参数名称重复');
        throw Error('参数名称重复');
      }
      return onChange({ extra: [...extraParams, newParam], slots: slotParams });
    },
    [onChange, value],
  );
  const onUpdateParam = useCallback(
    (values, formInstance, editItem) => {
      const { name } = values;
      if (!name && editItem.isExtra) {
        message.error('参数名称必填');
        throw Error('参数名称必填');
      }
      if (name === INTENT_NAME || name === WIDGET_TYPE) {
        message.error('参数名称重复');
        throw Error('参数名称重复');
      }
      if (name && editItem.isExtra) {
        if (flow(
          reject(propEq('name', editItem.name)),
          hasDuplicatedName(name),
        )([...extraParams, ...slotParams])) {
          message.error('参数名称重复');
          throw Error('参数名称重复');
        }
      }
      if (name && editItem.isSlot) {
        if (hasDuplicatedName(name)(extraParams)
          || flow(reject(propEq('value', editItem.value)), hasDuplicatedName(name))(slotParams)) {
          message.error('参数名称重复');
          throw Error('参数名称重复');
        }
      }
      if (editItem.isExtra) {
        return onChange({
          extra: map((param) => {
            if (param.name === editItem.name) {
              return values;
            }
            return param;
          })(extraParams),
          slots: slotParams,
        });
      }
      return onChange({
        extra: extraParams,
        slots: map((param) => {
          if (param.value === editItem.value) {
            return values;
          }
          return param;
        })(slotParams),
      });
    },
    [onChange, value],
  );
  const onRemoveParam = useCallback(async ({ name }) => {
    onChange({
      extra: reject(propEq('name', name))(extraParams),
      slots: slotParams,
    });
  }, [onChange, value]);

  const fields = isEditingSlot ? [{
    label: '参数名称',
    name: 'name',
    type: 'text',
  }, {
    label: '取值',
    name: 'value',
    component: PlainText,
  }, {
    label: '测试示例',
    name: 'example',
    type: 'text',
  }] : [{
    label: '参数名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '取值',
    name: 'value',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '测试示例',
    name: 'example',
    type: 'text',
  }];

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
    },
    createButton: {
      text: '创建自定义参数',
      size: 'middle',
    },
    creator: {
      title: '创建自定义参数',
      onSubmit: onCreateParam,
      fields,
      component: Drawer,
      width: 600,
      showSuccessMessage: false,
    },
    editor: {
      title: '编辑参数',
      onSubmit: onUpdateParam,
      fields,
      onClose: () => setIsEditingSlot(false),
      component: Drawer,
      width: 600,
      showSuccessMessage: false,
    },
  });

  const columns = [{
    title: '参数名称',
    dataIndex: 'name',
  }, {
    title: '取值',
    dataIndex: 'value',
  }, {
    title: '测试示例',
    dataIndex: 'example',
  }, {
    title: '操作',
    width: 140,
    render: (record) => (
      <>
        {(record.isSlot || record.isExtra) && (
          <Button
            type="primary"
            size="small"
            ghost
            onClick={() => {
              setIsEditingSlot(record.isSlot);
              openEditor(record);
            }}
          >
            编辑
          </Button>
        )}
        &nbsp;&nbsp;
        {record.isExtra && (
          <Popconfirm
            title="确认删除吗？删除操作不可恢复"
            onConfirm={() => onRemoveParam(record)}
          >
            <Button type="danger" size="small" ghost>删除</Button>
          </Popconfirm>
        )}
      </>
    ),
  }];

  return (
    <div className={s.Root}>
      {tableHeader}
      <Table
        dataSource={getDataSource([{
          name: INTENT_NAME,
          value: intentName,
          example: intentName,
        }, {
          name: WIDGET_TYPE,
          value: component,
          example: component,
        }, ...slotParams, ...extraParams])}
        columns={columns}
        rowKey={(record) => `${record.name}${record.value}`}
        pagination={pagination}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  onChange: func,
  value: object,
  intentName: string.isRequired,
  component: string.isRequired,
};

export default result;
