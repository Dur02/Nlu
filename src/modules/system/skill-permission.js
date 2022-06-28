import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Select,
  Modal,
  Button,
} from 'antd';
import { useLocalTable } from 'relient-admin/hooks';
import { PlainText } from 'relient-admin/components';
import { update as updateSkillPermission } from 'shared/actions/skill-permission';
import { getEntityArray } from 'relient/selectors';
import { getSkillOptions, getSkillsWithCodeKey } from 'shared/selectors';
import { flow, map, prop, join } from 'lodash/fp';

const result = () => {
  const {
    users,
    skillOptions,
  } = useSelector((state) => {
    const skillsWithCodeKey = getSkillsWithCodeKey(state);

    return {
      users: flow(
        getEntityArray('skillPermission'),
        map((skillPermission) => ({
          ...skillPermission,
          skillPermissionDisplay: flow(
            map((skillCode) => prop([skillCode, 'name'])(skillsWithCodeKey)),
            join(', '),
          )(skillPermission.skillCodes),
        })),
      )(state),
      skillOptions: getSkillOptions(state),
    };
  });

  const editorFields = [{
    label: '用户名称',
    name: 'name',
    component: PlainText,
  }, {
    label: '技能权限',
    name: 'skillCodes',
    component: Select,
    mode: 'multiple',
    options: skillOptions,
  }];

  const dispatch = useDispatch();
  const onUpdate = useCallback(async (values) => {
    await dispatch(updateSkillPermission({ userId: values.id, skillCodes: values.skillCodes }));
  }, [updateSkillPermission, dispatch]);

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
      }, {
        dataKey: 'nickName',
        label: '昵称',
      }],
      fussy: true,
    },
    showReset: true,
    editor: {
      title: '编辑技能权限',
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
    title: '技能权限',
    dataIndex: 'skillPermissionDisplay',
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
          编辑技能权限
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
        rowKey="userId"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
