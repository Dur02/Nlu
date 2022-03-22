import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Table, Drawer, message, Select, Input, Modal, Button, Upload } from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { remove, create, update, readAll } from 'shared/actions/skill';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllWords } from 'shared/actions/words';
import { readAll as readAllRule } from 'shared/actions/rule';
import { UploadOutlined } from '@ant-design/icons';
import {
  create as createVersion,
  createDraft as createDraftVersionAction,
  readAll as readAllSkillVersion,
} from 'shared/actions/skill-version';
import { useAction } from 'relient/actions';
import { push as pushAction } from 'relient/actions/history';
import { find, propEq, flow, prop, includes, reject, eq } from 'lodash/fp';
import { skillCategoryOptions, skillCategories } from 'shared/constants/skill-category';
import WordGraph from 'shared/components/word-graph';
import { getColumns, versionColumns } from './skill-columns';
import { columns } from './components/skii-test-columns';

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

  const {
    detailsVisible: wordGraphVisible,
    openDetails: openWordGraph,
    closeDetails: closeWordGraph,
    detailsItem: wordGraphItem,
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

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState([]);
  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
        await Promise.all([
          dispatch(readAll()),
          dispatch(readAllBuiltinIntent()),
          dispatch(readAllIntent()),
          dispatch(readAllOutput()),
          dispatch(readAllWords()),
          dispatch(readAllRule()),
          dispatch(readAllSkillVersion()),
        ]);
        message.success('上传成功');
      } else if (response.data && response.data.length > 0) {
        const newArray = response.data.map((item, index) => ({ ...item, key: index + 1 }));
        // eslint-disable-next-line max-len
        // flow(prop('data'), map((item, index) => ({ ...item, key: index + 1 })), setError)(response);
        setError(newArray);
      } else {
        message.error(response.msg);
      }
      setUploading(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
    }
  }, []);

  const [testing, setTesting] = useState(false);
  const onTest = useCallback(async ({ file: { status, response } }) => {
    setTesting(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
      } else if (response.data && response.data.length > 0) {
        const newArray = response.data.map((item, index) => ({ ...item, key: index + 1 }));
        setError(newArray);
      } else {
        message.error(response.msg);
      }
      setTesting(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
    }
  }, []);

  const closeErrorInfo = useCallback(() => {
    setError([]);
  });

  return (
    <Layout>
      {tableHeader}
      <Upload
        name="file"
        action="/skill/edit/skill/excel-import"
        onChange={onUpload}
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          type="primary"
          loading={uploading}
          size="large"
          style={{
            position: 'absolute',
            top: 24,
            left: 140,
          }}
        >
          上传技能
        </Button>
      </Upload>
      <Upload
        name="file"
        action="/skill/edit/skill/excel-import/test"
        onChange={onTest}
        showUploadList={false}
      >
        <Button
          icon={<UploadOutlined />}
          loading={testing}
          size="large"
          type="primary"
          ghost
          style={{
            position: 'absolute',
            top: 24,
            left: 280,
          }}
        >
          测试上传文件
        </Button>
      </Upload>
      <Table
        dataSource={getDataSource(skills)}
        columns={getColumns({
          openEditor,
          onRemove,
          openVersion,
          openWordGraph,
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
      {wordGraphItem && (
        <Modal
          visible={wordGraphVisible}
          onCancel={closeWordGraph}
          title={`${wordGraphItem.name} 词图`}
          width={800}
        >
          <WordGraph skillCode={wordGraphItem.code} />
        </Modal>
      )}
      <Modal
        visible={error.length > 0}
        onOk={closeErrorInfo}
        onCancel={closeErrorInfo}
        title="错误提示"
        width={1000}
      >
        <Table
          columns={columns}
          dataSource={error}
          rowKey={error.key}
        />
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
