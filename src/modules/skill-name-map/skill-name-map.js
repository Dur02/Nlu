import React from 'react';
import Layout from 'shared/components/layout';
import { Modal, Select, Table } from 'antd';
import { useSelector } from 'react-redux';
import { useLocalTable } from 'relient-admin/hooks';
import { useAction } from 'relient/actions';
import { create, update, remove } from 'shared/actions/skill-name-map';
import selector from './skill-name-map-selector';
import columns from './skill-name-map-columns';

const result = () => {
  const {
    skillNameMap,
    apps,
    standardSkillNames,
  } = useSelector(selector);

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onRemove = useAction(remove);

  const fields = [{
    label: 'APP',
    name: 'appId',
    component: Select,
    options: apps,
    rules: [{ required: true }],
  }, {
    label: '技能定义',
    name: 'standardName',
    component: Select,
    options: standardSkillNames,
    rules: [{ required: true }],
  }, {
    label: 'id',
    name: 'id',
    type: 'text',
    autoComplete: 'off',
    hidden: true,
    rules: [{ required: true }],
    labelCol: { offset: 4 },
  }];

  const {
    tableHeader,
    getDataSource,
    pagination,
    openEditor,
  } = useLocalTable({
    showReset: false,
    createButton: {
      text: '创建映射',
    },
    creator: {
      title: '创建映射',
      onSubmit: onCreate,
      fields,
      initialValues: {
        id: '0',
      },
      component: Modal,
    },
    editor: {
      title: '编辑映射',
      onSubmit: onUpdate,
      fields,
      component: Modal,
    },
  });

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(skillNameMap)}
        columns={columns({
          openEditor,
          onRemove,
        })}
        scroll={{
          y: 600,
        }}
        rowKey="id"
        pagination={pagination}
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
