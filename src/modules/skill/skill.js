import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Drawer,
  message,
  Select,
  Input,
  Modal, Form, Button,
} from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { remove, create, update, skillYamlExport } from 'shared/actions/skill';
import {
  create as createVersion,
  createDraft as createDraftVersionAction,
} from 'shared/actions/skill-version';
import { useAction } from 'relient/actions';
import { push as pushAction } from 'relient/actions/history';
import { find, propEq, flow, prop, map } from 'lodash/fp';
// import { skillCategoryOptions, skillCategories } from 'shared/constants/skill-category';
import WordGraph from 'shared/components/word-graph';
import { readMine } from 'shared/actions/user';
import { getColumns, versionColumns } from './skill-columns';
import SkillImport from './components/skill-import';

import selector from './skill-selector';

const { Option } = Select;
const { Item } = Form;

const { TextArea } = Input;

const result = ({
  standardName,
}) => {
  const {
    skills,
  } = useSelector(selector);

  const dispatch = useDispatch();
  const push = useAction(pushAction);
  const readProfile = useAction(readMine);

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

  const {
    detailsVisible: exportVisible,
    openDetails: openExport,
    closeDetails: closeExport,
    detailsItem: exportItem,
  } = useDetails();

  const creatorFields = [{
    label: '名称',
    name: 'name',
    autoComplete: 'off',
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '标准名',
    name: 'category',
    component: Select,
    options: standardName,
  }];

  const editorFields = [{
    // label: '名称',
    name: 'id',
    hidden: true,
    type: 'text',
    rules: [{ required: true }],
  }, {
    // label: '名称',
    name: 'name',
    hidden: true,
    type: 'text',
    rules: [{ required: true }],
  }, {
    label: '标准名',
    name: 'category',
    component: Select,
    options: standardName,
  }];

  const versionFields = [{
    label: '发布说明',
    name: 'note',
    component: TextArea,
    rules: [{ required: true }],
  }];

  const onCreate = useCallback(async (values) => {
    await dispatch(create(values));
    await dispatch(readMine());
  }, []);
  const onUpdate = useAction(update);
  const createDraft = useAction(createDraftVersionAction);
  const onCreateVersion = useCallback(
    (values) => dispatch(createVersion({ ...values, skillId: versionItem.id })),
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
      text: '创建技能',
    },
    creator: {
      title: '创建技能',
      onSubmit: ({ name, category }) => {
        if (category !== '') {
          return onCreate({ name, category });
        }
        return onCreate({ name, category: name });
      },
      fields: creatorFields,
      component: Drawer,
      initialValues: {
        category: '',
      },
    },
    editor: {
      title: '编辑技能基础信息',
      onSubmit: ({ id, name, category }) => {
        if (category !== '') {
          return onUpdate({ skillId: id, category });
        }
        return onUpdate({ skillId: id, category: name });
      },
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

  const onFinish = useCallback(async (value) => {
    try {
      const res = await dispatch(skillYamlExport({ id: value.id }));
      const blob = new Blob([res], { type: 'application/force-download' });
      // 创建新的URL并指向File对象或者Blob对象的地址
      const blobURL = window.URL.createObjectURL(blob);
      // 创建a标签，用于跳转至下载链接
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = blobURL;
      const date = new Date();
      tempLink.setAttribute('download', `${value.name}-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.yml`);
      // tempLink.setAttribute(
      //   'download', decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]
      // ));
      // 兼容：某些浏览器不支持HTML5的download属性
      if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank');
      }
      // 挂载a标签
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      // 释放blob URL地址
      window.URL.revokeObjectURL(blobURL);
      closeExport();
      message.success('导出成功');
    } catch (e) {
      message.error('导出失败');
    }
  }, []);

  return (
    <Layout>
      {tableHeader}
      <SkillImport />
      <Table
        dataSource={getDataSource(skills)}
        columns={getColumns({
          openEditor,
          onRemove,
          openVersion,
          openWordGraph,
          push,
          createDraft,
          readProfile,
          openExport,
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
      {wordGraphItem && (
        <Modal
          visible={wordGraphVisible}
          onCancel={closeWordGraph}
          onOk={closeWordGraph}
          title={`${wordGraphItem.name} 词图`}
          width={800}
        >
          <WordGraph skillId={wordGraphItem.id} />
        </Modal>
      )}
      {exportItem && (
        <Modal
          visible={exportVisible}
          onCancel={closeExport}
          footer={null}
          title={`${exportItem.name} 导出`}
          width={400}
        >
          <Form
            onFinish={onFinish}
            initialValues={{
              name: exportItem.name,
            }}
          >
            <Item
              name="name"
              style={{
                display: 'none',
              }}
            >
              <Input />
            </Item>
            <Item
              name="id"
              label="版本"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select
                placeholder="选择一个版本"
                allowClear
              >
                {
                  flow(
                    map(({ id, version }) => (
                      <Option key={id} value={id}>{version}</Option>
                    )),
                  )(exportItem.skillVersions)
                }
              </Select>
            </Item>
            <Item
              style={{
                position: 'relative',
                left: '150px',
              }}
            >
              <Button htmlType="submit">导出</Button>
            </Item>
          </Form>
        </Modal>
      )}
    </Layout>
  );
};

result.displayName = __filename;

export default result;
