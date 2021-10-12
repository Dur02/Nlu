import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table, Drawer, Button, Popconfirm, message, Input } from 'antd';
import { useLocalTable } from 'relient-admin/hooks';
import { getEntityArray } from 'relient/selectors';
import { remove, create } from 'shared/actions/product';

const { TextArea } = Input;

const result = () => {
  const {
    products,
  } = useSelector((state) => ({
    products: getEntityArray('product')(state),
  }));

  const dispatch = useDispatch();

  const fields = [{
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '描述',
    name: 'description',
    component: TextArea,
    rules: [{ required: true }],
  }];

  const onCreate = useCallback(async (values) => {
    await dispatch(create(values));
  }, []);

  const {
    tableHeader,
    getDataSource,
    pagination,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
    },
    showReset: true,
    createButton: {
      text: '创建产品',
    },
    creator: {
      title: '创建产品',
      onSubmit: onCreate,
      fields,
      component: Drawer,
    },
  });

  const onRemove = useCallback(async (id) => {
    await dispatch(remove({ id }));
    message.success('删除成功');
  }, []);

  const columns = [{
    title: 'ID',
    dataIndex: 'id',
  }, {
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '创建时间',
    dataIndex: 'createTime',
  }, {
    title: '创建人',
    dataIndex: 'createPerson',
  }, {
    title: '操作',
    width: 110,
    render: (record) => (
      <>
        <Popconfirm
          title="确认删除吗？删除操作不可恢复"
          onConfirm={() => onRemove(record.id)}
        >
          <Button type="danger" size="small" ghost>删除</Button>
        </Popconfirm>
      </>
    ),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table dataSource={getDataSource(products)} columns={columns} rowKey="id" pagination={pagination} />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
