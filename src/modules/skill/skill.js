import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Table,
  Drawer,
  message,
  Select,
  Input,
  Modal,
  Button,
  Upload,
  Tooltip, Form,
} from 'antd';
import { useLocalTable, useDetails } from 'relient-admin/hooks';
import { remove, create, update, readAll } from 'shared/actions/skill';
import { readAll as readAllBuiltinIntent } from 'shared/actions/builtin-intent';
import { readAll as readAllIntent } from 'shared/actions/intent';
import { readAll as readAllOutput } from 'shared/actions/output';
import { readAll as readAllWords } from 'shared/actions/words';
import { readAll as readAllRule } from 'shared/actions/rule';
import { DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import {
  create as createVersion,
  createDraft as createDraftVersionAction,
  readAll as readAllSkillVersion,
} from 'shared/actions/skill-version';
import { useAction } from 'relient/actions';
import { push as pushAction } from 'relient/actions/history';
import { find, propEq, flow, prop, includes, reject, eq, map, uniqBy, sortBy } from 'lodash/fp';
import { skillCategoryOptions, skillCategories } from 'shared/constants/skill-category';
import WordGraph from 'shared/components/word-graph';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import { getColumns, versionColumns } from './skill-columns';
import { columns } from './components/skill-test-columns';

import selector from './skill-selector';

const { Option } = Select;

const mapWithIndex = map.convert({ cap: false });

const { TextArea } = Input;

const result = () => {
  const [uploadForm] = Form.useForm();
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

  const [visible, setVisible] = useState(false);
  // modal是否可见
  const [uploadFlag, setUploadFlag] = useState(false);
  // upload是否可用,false不可用，true表示可用
  const [uploadType, setUploadType] = useState();
  // upload的类型，当uploadFlag为true时，uploadType为true显示上传的Upload，为false显示测试的Upload
  const [action, setAction] = useState('/skill/edit/skill/excel-import/v2');
  const [skillCodeList, setSkillCodeList] = useState([]);
  const [skillCode, setSkillCode] = useState('');
  const [isInputShow, setIsInputShow] = useState(true);

  const openImportForm = useCallback(
    async () => {
      const res = await dispatch(readAll());
      const code = uniqBy('code')(sortBy((o) => -o.id)(res.data.records));
      setSkillCodeList(code);
      setVisible(true);
      setAction('/skill/edit/skill/excel-import/v2');
      setUploadType(true);
    },
    [visible, setVisible],
  );

  const openTestForm = useCallback(
    async () => {
      const res = await dispatch(readAll());
      const code = uniqBy('code')(sortBy((o) => -o.id)(res.data.records));
      setSkillCodeList(code);
      setVisible(true);
      setAction('/skill/edit/skill/excel-import/test/v2');
      setUploadType(false);
    },
    [visible, setVisible],
  );

  const closeForm = useCallback(
    () => {
      setVisible(false);
      setUploadFlag(false);
      setAction('/skill/edit/skill/excel-import/v2');
      uploadForm.resetFields();
      setSkillCode('');
      setUploadFlag(false);
      setIsInputShow(true);
    },
    [visible, setVisible],
  );

  const onNameChange = useCallback(
    (value) => {
      if (value.target.value !== '') {
        setUploadFlag(true);
        let baseUrl;
        if (action.includes('/skill/edit/skill/excel-import/v2')) {
          baseUrl = '/skill/edit/skill/excel-import/v2';
        } else {
          baseUrl = '/skill/edit/skill/excel-import/test/v2';
        }
        setAction(`${baseUrl}?skillName=${value.target.value}`);
      } else if (value.target.value === '') {
        setUploadFlag(false);
      }
    }, [uploadFlag, setUploadFlag, action, setAction],
  );

  const onCodeChange = useCallback(
    (value) => {
      if (value !== '') {
        setIsInputShow(false);
        const temp = find((o) => o.code === value)(skillCodeList);
        let baseUrl;
        if (action.includes('/skill/edit/skill/excel-import/v2')) {
          baseUrl = '/skill/edit/skill/excel-import/v2';
        } else {
          baseUrl = '/skill/edit/skill/excel-import/test/v2';
        }
        setAction(`${baseUrl}?skillName=${temp.name}&skillCode=${temp.code}`);
        setUploadFlag(true);
        setSkillCode(value);
      } else if (value === '') {
        uploadForm.resetFields();
        setSkillCode('');
        setUploadFlag(false);
        setIsInputShow(true);
      }
    }, [skillCodeList, setSkillCode, action, setAction, isInputShow, setIsInputShow],
  );

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
        flow(mapWithIndex((item, index) => ({ ...item, key: index + 1 })), setError)(response.data);
      } else {
        message.error(response.msg);
      }
      setUploadFlag(false);
      setUploadType(true);
      setUploading(false);
      uploadForm.resetFields();
      setVisible(false);
      setSkillCode('');
      setUploadFlag(false);
      setIsInputShow(true);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploadFlag(false);
      setUploadType(true);
      setUploading(false);
      uploadForm.resetFields();
      setVisible(false);
      setSkillCode('');
      setUploadFlag(false);
      setIsInputShow(true);
    }
  }, [skillCode, onCodeChange]);

  const [testing, setTesting] = useState(false);
  const onTest = useCallback(async ({ file: { status, response } }) => {
    setTesting(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确');
      } else if (response.data && response.data.length > 0) {
        flow(mapWithIndex((item, index) => ({ ...item, key: index + 1 })), setError)(response.data);
      } else {
        message.error(response.msg);
      }
      setUploadFlag(false);
      setUploadType(false);
      setTesting(false);
      uploadForm.resetFields();
      setVisible(false);
      setSkillCode('');
      setUploadFlag(false);
      setIsInputShow(true);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploadFlag(false);
      setUploadType(false);
      setTesting(false);
      uploadForm.resetFields();
      setVisible(false);
      setSkillCode('');
      setUploadFlag(false);
      setIsInputShow(true);
    }
  }, [skillCode, onCodeChange]);

  const closeErrorInfo = useCallback(
    () => {
      setError([]);
    },
    [setError],
  );

  return (
    <Layout>
      {tableHeader}
      <Button
        icon={<UploadOutlined />}
        type="primary"
        loading={uploading}
        onClick={openImportForm}
        size="large"
        style={{
          position: 'absolute',
          top: 24,
          left: 140,
        }}
      >
        上传技能
      </Button>
      <Button
        icon={<UploadOutlined />}
        loading={testing}
        onClick={openTestForm}
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
      <a
        href={`${getWithBaseUrl('/template.xlsx', getConfig('baseUrl'))}`}
        download="语料模板.xlsx"
      >
        <Tooltip
          title="下载模板"
          placement="top"
        >
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            ghost
            style={{
              position: 'absolute',
              top: 24,
              left: 450,
            }}
          />
        </Tooltip>
      </a>
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
          onOk={closeWordGraph}
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
        />
      </Modal>
      <Modal
        footer={null}
        onCancel={closeForm}
        visible={visible}
      >
        <Form
          form={uploadForm}
          autoComplete="off"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            skillCode: '',
          }}
          style={{
            marginTop: '40px',
          }}
        >
          {
            isInputShow
            && (
            <Form.Item
              label="技能名"
              name="skillName"
              rules={[{ required: true }]}
            >
              <Input
                placeholder="请输入技能名"
                onChange={onNameChange}
                allowClear
              />
            </Form.Item>
            )
          }
          <Form.Item
            label="技能代号"
            name="skillCode"
          >
            <Select
              onChange={onCodeChange}
            >
              <Option value=""><b>无</b></Option>
              {
                map((item) => (
                  <Option style={{ position: 'relative' }} value={item.code} key={item.id}>
                    <b
                      style={{
                        width: '55%',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </b>
                    &nbsp;&nbsp;
                    <i
                      style={{
                        width: '18%',
                        position: 'absolute',
                        left: '50%',
                        overflow: 'hidden',
                      }}
                    >
                      {item.version}
                    </i>
                    &nbsp;&nbsp;
                    <i
                      style={{
                        width: '27%',
                        overflow: 'hidden',
                        position: 'absolute',
                        left: '70%',
                      }}
                    >
                      {item.createDate.slice(0, 10)}
                    </i>
                  </Option>
                ))(skillCodeList)
              }
            </Select>
          </Form.Item>
          <Form.Item
            label="选择文件"
          >
            {
              uploadType === true
                ? (
                  <Upload
                    name="file"
                    action={action}
                    onChange={onUpload}
                    showUploadList={false}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={uploading}
                      disabled={!uploadFlag}
                    >
                      上传
                    </Button>
                  </Upload>
                )
                : (
                  <Upload
                    name="file"
                    action={action}
                    onChange={onTest}
                    showUploadList={false}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={testing}
                      disabled={!uploadFlag}
                    >
                      测试
                    </Button>
                  </Upload>
                )
            }
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
