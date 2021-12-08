import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table, Drawer, message, Select, Input } from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { remove, create, update } from 'shared/actions/skill';
import { create as createVersion, createDraft as createDraftVersionAction } from 'shared/actions/skill-version';
import { useAction } from 'relient/actions';
import { push as pushAction } from 'relient/actions/history';
import { find, propEq, flow, prop, includes, reject, eq } from 'lodash/fp';
import { skillCategoryOptions, skillCategories } from 'shared/constants/skill-category';
import { getColumns, versionColumns } from './skill-columns';

import selector from './skill-selector';

const { TextArea } = Input;

const result = () => {
  const {
    skills,
  } = useSelector(selector);

  const dispatch = useDispatch();
  const push = useAction(pushAction);

  const {
    detailsVisible: versionVisible,
    openDetails: openVersion,
    closeDetails: closeVersion,
    detailsItem: versionItem,
  } = useDetails();

  const editorFields = [{
    label: '名称',
    name: 'name',
    type: 'text',
    rules: [{ required: true }],
    // }, {
    //   label: '图标',
    //   name: 'iconPath',
    //   component: Group,
    //   options: iconPathOptions,
    //   rules: [{ required: true }],
  }];

  const creatorFields = [...editorFields, {
    label: '分类',
    name: 'category',
    component: Select,
    options: skillCategoryOptions,
    rules: [{ required: true }],
  }];

  const versionFields = [{
    label: '发布说明',
    name: 'note',
    component: TextArea,
    rules: [{ required: true }],
  }];

  const onCreate = useAction(create);
  const onUpdate = useAction(update);
  const onCreateVersion = useCallback(
    (values) => dispatch(createVersion({ ...values, skillId: versionItem.id })),
    [versionItem && versionItem.id],
  );

  const [creatingDraftSkillIds, setCreatingDraftSkillIds] = useState([]);
  const createDraft = useCallback(async (skillId) => {
    try {
      await dispatch(createDraftVersionAction({ skillId }));
      message.success('拷贝技能成功，可以进行技能编辑');
      if (!includes(skillId)(creatingDraftSkillIds)) {
        setCreatingDraftSkillIds([...creatingDraftSkillIds, skillId]);
      }
    } catch (e) {
      console.error(e);
    }
    setCreatingDraftSkillIds(reject(eq(skillId))(creatingDraftSkillIds));
  }, [JSON.stringify(creatingDraftSkillIds)]);

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
      text: '创建技能',
    },
    creator: {
      title: '创建技能',
      onSubmit: onCreate,
      fields: creatorFields,
      initialValues: {
        category: skillCategories[0],
        // iconPath: iconPaths[0],
      },
      component: Drawer,
    },
    editor: {
      title: '编辑技能',
      onSubmit: onUpdate,
      fields: editorFields,
      component: Drawer,
    },
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
      text: '发布技能',
    },
  });

  const onRemove = useCallback(async (id) => {
    await dispatch(remove({ id }));
    message.success('删除成功');
  }, []);

  return (
    <Layout>
      {tableHeader}
      <Table
        dataSource={getDataSource(skills)}
        columns={getColumns({
          openEditor,
          onRemove,
          openVersion,
          push,
          createDraft,
          creatingDraftSkillIds,
        })}
        rowKey="id"
        pagination={pagination}
      />
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
              prop('skillVersions'),
            )(skills))}
            columns={versionColumns}
            rowKey="id"
            pagination={versionPagination}
          />
        </Drawer>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
