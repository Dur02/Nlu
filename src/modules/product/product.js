import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table, Drawer, message, Input, Modal } from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { readAll, remove, create, update, detachSkills, attachSkills } from 'shared/actions/product';
import { create as createVersion } from 'shared/actions/product-version';
import { useAction } from 'relient/actions';
import { find, propEq, flow, prop } from 'lodash/fp';
import WordGraph from 'shared/components/product-word-graph';
import { getColumns, getSkillEditorColumns, versionColumns } from './product-columns';

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

  const {
    detailsVisible: versionVisible,
    openDetails: openVersion,
    closeDetails: closeVersion,
    detailsItem: versionItem,
  } = useDetails();

  const {
    detailsVisible: wordGraphVisible,
    openDetails: openWordGraph,
    closeDetails: closeWordGraph,
    detailsItem: wordGraphItem,
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

  const versionFields = [{
    label: '版本名称',
    name: 'versionName',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '发布说明',
    name: 'description',
    component: TextArea,
  }];

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onAttach = useCallback(async ({ skillId, productId, skillName, preLoad }) => {
    await dispatch(attachSkills({
      id: productId,
      skillInfos: { skillId, skillName, preLoad },
    }));
    await dispatch(readAll());
    // 原本为什么需要在新增技能后刷新此技能的版本信息？暂没发现用处先注释
    // await dispatch(readAllVersion({ productId }));
    message.success('添加成功');
  }, []);
  const onDetach = useCallback(async ({ skillId, productId, skillName }) => {
    await dispatch(detachSkills({
      id: productId, skillIds: [skillId], skillName: [skillName],
    }));
    message.success('去掉成功');
  }, []);
  const onCreateVersion = useCallback(
    (values) => dispatch(createVersion({ ...values, productId: versionItem.id })),
    [versionItem && versionItem.id],
  );

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
    reset: resetSkillTable,
  } = useLocalTable({
    query: {
      width: 150,
      fields: [{
        dataKey: 'name',
        label: '名称',
      }],
    },
    showReset: true,
  });

  const {
    tableHeader: versionTableHeader,
    getDataSource: versionGetDataSource,
    pagination: versionPagination,
  } = useLocalTable({
    creator: {
      title: '创建版本',
      onSubmit: onCreateVersion,
      fields: versionFields,
      component: Drawer,
    },
    createButton: {
      text: '发布产品',
    },
  });

  useEffect(() => {
    if (!skillEditorVisible) {
      resetSkillTable();
    }
  }, [skillEditorVisible]);

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
          openVersion,
          openWordGraph,
        })}
        rowKey="id"
        pagination={pagination}
      />
      {skillEditorItem && (
        <Drawer
          visible={skillEditorVisible}
          onClose={closeSkillEditor}
          title={`${skillEditorItem.name} 编辑技能`}
          width={600}
          destroyOnClose="true"
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
      {versionItem && (
        <Drawer
          visible={versionVisible}
          onClose={closeVersion}
          title={`${versionItem.name} 发布`}
          width={800}
        >
          {versionTableHeader}
          <Table
            dataSource={versionGetDataSource(flow(
              find(propEq('id', versionItem.id)),
              prop('productVersions'),
            )(products))}
            columns={versionColumns}
            rowKey="id"
            pagination={versionPagination}
          />
        </Drawer>
      )}
      {wordGraphItem && (
        <Modal
          visible={wordGraphVisible}
          onCancel={closeWordGraph}
          onOk={closeWordGraph}
          title={`${wordGraphItem.name} 词图`}
          width={800}
        >
          <WordGraph productId={wordGraphItem.id} />
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
