import React from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Modal,
  Button,
  Tree,
  Typography,
} from 'antd';
import { useLocalTable } from 'relient-admin/hooks';
import { create, update } from 'shared/actions/role';
import { useAction } from 'relient/actions';
import { flow, prop, map, join } from 'lodash/fp';
import { getRoles, getResourceOptions } from 'shared/selectors';
// import { getEntityArray } from 'relient/selectors';

const { Paragraph } = Typography;
const result = () => {
  const {
    roles,
    resourceOptions,
  } = useSelector((state) => ({
    roles: getRoles(state),
    resourceOptions: getResourceOptions(state),
  }));

  const fields = [{
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '权限',
    name: 'resourceIds',
    component: Tree,
    valuePropName: 'checkedKeys',
    trigger: 'onCheck',
    treeData: resourceOptions,
    checkable: true,
  }];

  const onCreate = useAction(create);
  const onUpdate = useAction(update);

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
      fussy: true,
    },
    showReset: true,
    createButton: {
      text: '创建角色',
    },
    creator: {
      title: '创建角色',
      onSubmit: onCreate,
      fields,
      initialValues: {
        openMfa: true,
        roleIds: [],
      },
      component: Modal,
    },
    editor: {
      title: '编辑角色',
      onSubmit: onUpdate,
      fields,
      component: Modal,
    },
  });

  const columns = [{
    title: '名称',
    dataIndex: 'name',
    width: 120,
  }, {
    title: '权限',
    dataIndex: 'resources',
    render: (record) => (
      <Paragraph
        ellipsis={{
          rows: 3,
          expandable: true,
          // suffix: '--William Shakespeare',
          // onEllipsis: ellipsis => {
          //   console.log('Ellipsis changed:', ellipsis);
          // },
        }}
      >
        {flow(map(prop('resourceName')), join(', '))(record)}
      </Paragraph>
    ),
  }, {
    title: '操作',
    key: 'operations',
    width: 120,
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
        dataSource={getDataSource(roles)}
        columns={columns}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
