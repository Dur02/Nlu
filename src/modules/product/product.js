import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table, Drawer, message, Input } from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { remove, create, update, detachSkills, attachSkills } from 'shared/actions/product';
import { useAction } from 'relient/actions';
import { find, propEq } from 'lodash/fp';
import { getColumns, getSkillEditorColumns } from './product-columns';

import selector from './product-selector';

const { TextArea } = Input;

const result = () => {
  const {
    products,
    skills,
  } = useSelector(selector);

  const dispatch = useDispatch();

  const {
    detailsVisible: skillEditorVisible,
    openDetails: openSkillEditor,
    closeDetails: closeSkillEditor,
    detailsItem: skillEditorItem,
  } = useDetails();

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

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onAttach = useCallback(async ({ skillId, productId }) => {
    await dispatch(attachSkills({ id: productId, skillIds: [skillId] }));
    message.success('添加成功');
  }, []);
  const onDetach = useCallback(async ({ skillId, productId }) => {
    await dispatch(detachSkills({ id: productId, skillIds: [skillId] }));
    message.success('去掉成功');
  }, []);

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
      text: '创建产品',
    },
    creator: {
      title: '创建产品',
      onSubmit: onCreate,
      fields,
      component: Drawer,
    },
    editor: {
      title: '编辑产品',
      onSubmit: onUpdate,
      fields,
      component: Drawer,
    },
  });

  const {
    tableHeader: skillTableHeader,
    getDataSource: skillGetDataSource,
    pagination: skillPagination,
  } = useLocalTable({
    query: {
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
    },
    showReset: true,
  });

  const onRemove = useCallback(async (id) => {
    await dispatch(remove({ id }));
    message.success('删除成功');
  }, []);

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(products)}
        columns={getColumns({
          openEditor,
          onRemove,
          openSkillEditor,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {skillEditorItem && (
        <Drawer
          visible={skillEditorVisible}
          onClose={closeSkillEditor}
          title={`${skillEditorItem.name}编辑技能`}
          width={600}
        >
          {skillTableHeader}
          <Table
            dataSource={skillGetDataSource(skills)}
            columns={getSkillEditorColumns({
              product: find(propEq('id', skillEditorItem.id))(products),
              detach: onDetach,
              attach: onAttach,
            })}
            rowKey="id"
            pagination={skillPagination}
          />
        </Drawer>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
