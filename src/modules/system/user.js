import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Select,
  Modal,
  Button,
  Switch,
} from 'antd';
import { useLocalTable } from 'relient-admin/hooks';
import { PlainText } from 'relient-admin/components';
import { create, update } from 'shared/actions/user';
import { flow, prop, map, join } from 'lodash/fp';
import { getBooleanText } from 'shared/constants/boolean';
import { normalize, getValueFromEvent, getUserStatusText, ACTIVE, INACTIVE } from 'shared/constants/user-status';
import { update as updateSkillPermission } from 'shared/actions/skill-permission';

import selector from './user-selector';

const result = () => {
  const {
    users,
    roleOptions,
    skillOptions,
  } = useSelector(selector);

  const editorFields = [{
    label: '名称',
    name: 'name',
    component: PlainText,
  }, {
    label: '打开MFA',
    name: 'openMfa',
    component: Switch,
    rules: [{ required: true }],
    valuePropName: 'checked',
  }, {
    label: '密码',
    name: 'password',
    type: 'password',
  }, {
    label: '角色',
    name: 'roleIds',
    component: Select,
    mode: 'multiple',
    options: roleOptions,
  }, {
    label: '技能权限',
    name: 'skillCodes',
    component: Select,
    mode: 'multiple',
    options: skillOptions,
  }, {
    label: '状态',
    name: 'status',
    component: Switch,
    checkedChildren: getUserStatusText(ACTIVE),
    unCheckedChildren: getUserStatusText(INACTIVE),
    getValueFromEvent,
    getValueProps: (value) => ({ checked: normalize(value), value: normalize(value) }),
  }];

  const creatorFields = [{
    label: '昵称',
    name: 'nickName',
    type: 'text',
  }, {
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '打开MFA',
    name: 'openMfa',
    component: Switch,
    rules: [{ required: true }],
    valuePropName: 'checked',
  }, {
    label: '密码',
    name: 'password',
    type: 'password',
    rules: [{ required: true }],
  }, {
    label: '角色',
    name: 'roleIds',
    component: Select,
    mode: 'multiple',
    options: roleOptions,
  }, {
    label: '技能权限',
    name: 'skillCodes',
    component: Select,
    mode: 'multiple',
    options: skillOptions,
  }];

  const dispatch = useDispatch();
  const onCreate = useCallback(async (values) => {
    const { data: { id } } = await dispatch(create(values));
    await dispatch(updateSkillPermission({ userId: id, skillCodes: values.skillCodes }));
  }, [create, updateSkillPermission, dispatch]);
  const onUpdate = useCallback(async (values) => {
    await dispatch(update(values));
    await dispatch(updateSkillPermission({ userId: values.id, skillCodes: values.skillCodes }));
  }, [update, updateSkillPermission, dispatch]);

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
    showReset: true,
    createButton: {
      text: '创建用户',
    },
    creator: {
      title: '创建用户',
      onSubmit: onCreate,
      fields: creatorFields,
      initialValues: {
        openMfa: true,
        roleIds: [],
      },
      component: Modal,
    },
    editor: {
      title: '编辑用户',
      onSubmit: onUpdate,
      fields: editorFields,
      component: Modal,
    },
  });

  const columns = [{
    title: '昵称',
    dataIndex: 'nickName',
  }, {
    title: '名称',
    dataIndex: 'name',
  }, {
    title: '有无MFA',
    dataIndex: 'hasMfaSecret',
    render: getBooleanText,
  }, {
    title: '打开MFA',
    dataIndex: 'openMfa',
    render: getBooleanText,
  }, {
    title: '角色',
    dataIndex: 'roles',
    render: flow(map(prop('name')), join(', ')),
  }, {
    title: '状态',
    dataIndex: 'status',
    render: getUserStatusText,
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
        dataSource={getDataSource(users)}
        columns={columns}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
