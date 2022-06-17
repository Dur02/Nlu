import React from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Modal,
  Button,
} from 'antd';
import { useLocalTable } from 'relient-admin/hooks';
import { update } from 'shared/actions/resource';
import { useAction } from 'relient/actions';
import { getEntityArray } from 'relient/selectors';

const result = () => {
  const {
    resources,
  } = useSelector((state) => ({
    resources: getEntityArray('resource')(state),
  }));

  const editorFields = [{
    label: '名称',
    name: 'aliasName',
    rules: [{ required: true }],
  }];

  const onUpdate = useAction(update);

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    editor: {
      title: '编辑资源',
      onSubmit: onUpdate,
      fields: editorFields,
      component: Modal,
    },
  });

  const columns = [{
    title: '名称',
    dataIndex: 'aliasName',
  }, {
    title: '方法',
    dataIndex: 'method',
  }, {
    title: '资源名',
    dataIndex: 'resourceName',
  }, {
    title: '路径',
    dataIndex: 'resourcePath',
  }, {
    title: '类型',
    dataIndex: 'type',
  }, {
    title: '操作',
    key: 'operations',
    width: 200,
    render: (record) => (
      <>
        <Button
          type="primary"
          onClick={() => openEditor(record)}
          style={{ marginBottom: 10, marginRight: 10 }}
          size="small"
          ghost
        >
          编辑
        </Button>
      </>
    ),
  }];

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(resources)}
        columns={columns}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
