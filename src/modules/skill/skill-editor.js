import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import {
  Tabs,
  Empty,
  Input,
  message,
  Modal,
  Button,
  Upload,
  Table,
  Popover,
  Spin,
  Dropdown,
  Menu, Drawer,
} from 'antd';
import { DownOutlined, ToolOutlined, UploadOutlined } from '@ant-design/icons';
import useStyles from 'isomorphic-style-loader/useStyles';
// import { SEMANTIC } from 'shared/constants/intent-type';
import {
  create as createIntentAction,
  remove as removeIntentAction,
  update as updateIntentAction,
} from 'shared/actions/intent';
import {
  create as createRuleAction,
  remove as removeRuleAction,
  update as updateRuleAction,
} from 'shared/actions/rule';
import {
  create as createWordsAction,
  remove as removeWordsAction,
  update as updateWordsAction,
} from 'shared/actions/words';
import { useAction } from 'relient/actions';
import { find, propEq, flow, prop, eq, flatten, map, join } from 'lodash/fp';
import {
  readAll as readAllOutputAction,
  update as updateOutputAction,
} from 'shared/actions/output';
import {
  create as createVersion,
} from 'shared/actions/skill-version';
import { outputYamlExport } from 'shared/actions/skill';
import { useDetails, useLocalTable } from 'relient-admin/hooks';
import Rules from './components/rules';
import Intents from './components/intents';
import Output from './components/output';
import Migrate from './components/migrate';
import selector from './skill-editor-selector';
import s from './skill-editor.less';
import WordGraph from '../../shared/components/word-graph';
import GlobalSearchRules from './components/global-search-rules';
import { columns } from './components/skill-test-columns';
import FloatWindows from '../../shared/components/floating-windows';
import WordsDrawer from './components/words-drawer';
import { versionColumns } from './skill-columns';

const { TabPane } = Tabs;
const { Search, TextArea } = Input;
const mapWithIndex = map.convert({ cap: false });

const result = ({ skillId }) => {
  useStyles(s);

  const {
    detailsVisible: versionVisible,
    openDetails: openVersion,
    closeDetails: closeVersion,
    detailsItem: versionItem,
  } = useDetails();

  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [intentNameText, setIntentNameText] = useState('');
  const [wordGraphVisible, setWordGraphVisible] = useState(false);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [migrateVisible, setMigrateVisible] = useState(false);
  const [isText, setIsText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState([]);
  const [tempId, setTempId] = useState(-1);
  const [wordsDrawerVisible, setWordsDrawerVisible] = useState(false);

  const {
    intents,
    skillVersion,
    skill,
    builtinIntents,
    words,
    outputs,
    token,
  } = useSelector(selector(skillId, tempId));

  const selectedIntent = find(propEq('id', selectedIntentId))(intents);
  const selectedOutput = find(propEq('intentId', selectedIntentId))(outputs);

  const globalRules = flow(
    map(({ name, id, rules }) => (
      map((item2) => ({
        ...item2,
        name,
        intentId: id,
      }))(rules)
    )),
    flatten,
  )(intents);

  const dispatch = useDispatch();

  const attachSkillId = (action) => useCallback(
    (values) => dispatch(action({ skillId, ...values })),
    [skillId],
  );

  const createIntent = attachSkillId(createIntentAction);
  const removeIntent = attachSkillId(removeIntentAction);
  const updateIntent = attachSkillId(updateIntentAction);
  const createRule = attachSkillId(createRuleAction);
  const removeRule = attachSkillId(removeRuleAction);
  const updateRule = attachSkillId(updateRuleAction);
  const createWords = attachSkillId(createWordsAction);
  const removeWords = attachSkillId(removeWordsAction);
  const updateWords = attachSkillId(updateWordsAction);
  const updateOutput = attachSkillId(updateOutputAction);
  const readAllOutput = useAction(readAllOutputAction);

  const onChangeIntentId = useCallback(({ id, name }) => {
    setSelectedIntentId(id);
    setIntentNameText(name);
  }, [selectedIntentId, intentNameText]);

  const onChangeIntentNameText = useCallback(
    ({ target: { value } }) => setIntentNameText(value),
    [intentNameText]);

  const onSaveIntentNameText = useCallback(async () => {
    if (!flow(
      prop('name'),
      eq(intentNameText),
    )(selectedIntent)) {
      await updateIntent({ name: intentNameText, id: selectedIntent.id });
      message.success('编辑意图名称成功');
    }
  }, [intentNameText, selectedIntent]);

  const closeUpload = useCallback(() => {
    setUploadVisible(false);
    setIsText(false);
  }, [uploadVisible, setUploadVisible, isText, setIsText]);

  const closeErrorInfo = useCallback(() => setError([]), [setError]);

  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确,即将刷新数据');
        window.location.reload();
      } else if (response.data && response.data.length > 0) {
        if (isText) {
          flow(
            mapWithIndex((item, index) => ({
              ...item, key: index + 1,
            })),
            setError,
          )(response.data);
        } else {
          flow(
            map(prop('errorMsg')),
            join('，'),
            message.error,
          )(response.data);
        }
      } else {
        message.error(response.msg);
      }
      setUploading(false);
      setUploadVisible(false);
    } else if (status === 'error') {
      message.error(response ? response.msg : '上传失败，请稍后再试');
      setUploading(false);
      setUploadVisible(false);
    }
  }, [uploading, uploadVisible]);

  const onCreateVersion = useCallback(
    (values) => dispatch(createVersion({ ...values, skillId: versionItem.id })),
    [versionItem && versionItem.id],
  );

  const versionFields = [{
    label: '发布说明',
    name: 'note',
    component: TextArea,
    rules: [{ required: true }],
  }];

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

  const menu = (
    <Menu
      items={[{
        key: 'wordTable',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => {
              setWordsDrawerVisible(true);
            }}
          >
            词库
          </Button>
        ),
      }, {
        key: 'migrate',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => {
              setMigrateVisible(true);
            }}
          >
            迁移
          </Button>
        ),
      }, {
        key: 'textImport',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => {
              setUploadVisible(true);
              setIsText(true);
            }}
          >
            纯文本导入
          </Button>
        ),
      }, {
        key: 'outputImport',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => {
              setUploadVisible(true);
              setIsText(false);
            }}
          >
            技能回复导入
          </Button>
        ),
      }, {
        key: 'outputExport',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={async () => {
              try {
                const res = await dispatch(outputYamlExport({ skillId }));
                const blob = new Blob([res], { type: 'application/force-download' });
                const blobURL = window.URL.createObjectURL(blob);
                const tempLink = document.createElement('a');
                tempLink.style.display = 'none';
                tempLink.href = blobURL;
                const date = new Date();
                tempLink.setAttribute(
                  'download',
                  `${skill.name}(技能回复)-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.yml`,
                );
                if (typeof tempLink.download === 'undefined') {
                  tempLink.setAttribute('target', '_blank');
                }
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);
                window.URL.revokeObjectURL(blobURL);
                message.success('导出成功');
              } catch (e) {
                message.error('导出失败');
              }
            }}
          >
            技能回复导出
          </Button>
        ),
      }, {
        key: 'globalSearch',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => setGlobalSearch(true)}
          >
            全局说法检索
          </Button>
        ),
      }, {
        key: 'wordGraph',
        label: (
          <Button
            style={{
              width: '100%',
            }}
            ghost
            type="primary"
            onClick={() => setWordGraphVisible(true)}
          >
            词图
          </Button>
        ),
      }]}
    />
  );

  return (tempId === -1 || tempId === skillId) ? (
    <Layout
      subTitle={(
        <Popover
          content={<FloatWindows setTempId={setTempId} />}
          trigger="click"
          // visible={visible}
          // onVisibleChange={handleOpenChange}
        >
          {`${skill.name}(${skill.version})`}
          <DownOutlined style={{ paddingLeft: '8px', fontSize: '15px' }} />
        </Popover>
      )}
      addonAfter={(
        <>
          <Button
            type="primary"
            ghost
            style={{
              marginRight: '5px',
            }}
            onClick={() => {
              openVersion(
                flow(
                  find(propEq('id', skillId)),
                )(skillVersion),
              );
            }}
          >
            发布
          </Button>
          <Dropdown overlay={menu} placement="bottom">
            <span style={{ fontSize: '16px', marginTop: '2px' }}>工具栏<ToolOutlined style={{ paddingLeft: '8px', fontSize: '15px' }} /></span>
          </Dropdown>
        </>
      )}
    >
      <div className={s.Container}>
        <Intents
          onChangeIntentId={onChangeIntentId}
          createIntent={createIntent}
          skillId={skillId}
          intents={intents}
          builtinIntents={builtinIntents}
          intentId={selectedIntentId}
          removeIntent={removeIntent}
          readAllOutput={readAllOutput}
        />
        <div className={s.Content}>
          {selectedIntent && (
            <div className={s.IntentNameWrapper}>
              当前意图名称：
              <Search
                onSearch={onSaveIntentNameText}
                onChange={onChangeIntentNameText}
                value={intentNameText}
                className={s.IntentNameInput}
                enterButton="保存"
                // readOnly={selectedIntent.type !== SEMANTIC}
              />
            </div>
          )}
          {selectedIntent ? (
            <Tabs>
              {
                selectedIntent && (
                  <>
                    <TabPane tab="说法" key="1">
                      <Rules
                        createRule={createRule}
                        updateRule={updateRule}
                        removeRule={removeRule}
                        createWords={createWords}
                        updateWords={updateWords}
                        removeWords={removeWords}
                        updateIntent={updateIntent}
                        intentId={selectedIntentId}
                        slots={selectedIntent.slots}
                        rules={selectedIntent.rules}
                        skillId={skillId}
                        words={words}
                      />
                    </TabPane>
                    <TabPane tab="对话" key="2">
                      <Output
                        output={selectedOutput}
                        updateOutput={updateOutput}
                        intentName={selectedIntent.name}
                        intentId={selectedIntentId}
                        intents={intents}
                      />
                    </TabPane>
                  </>
                )
              }
            </Tabs>
          ) : (<Empty description="请选择意图" />)}
        </div>
      </div>
      <Modal
        visible={wordGraphVisible}
        onCancel={() => setWordGraphVisible(false)}
        title="词图"
        width={800}
        footer={null}
        centered="true"
      >
        <WordGraph skillId={skillId} />
      </Modal>
      <Modal
        visible={globalSearch}
        onCancel={() => setGlobalSearch(false)}
        title="全局说法检索"
        width={900}
        footer={null}
        destroyOnClose="true"
        centered="true"
      >
        <GlobalSearchRules
          onChangeIntentId={onChangeIntentId}
          setGlobalSearch={setGlobalSearch}
          updateRule={updateRule}
          removeRule={removeRule}
          createWords={createWords}
          updateWords={updateWords}
          removeWords={removeWords}
          updateIntent={updateIntent}
          rules={globalRules}
        />
      </Modal>
      <Modal
        visible={uploadVisible}
        onCancel={closeUpload}
        footer={null}
        title={isText ? '纯文本导入' : '技能回复导入'}
        width={400}
      >
        <Upload
          name="file"
          action={
            isText
              ? `/skill/edit/skill/excel-import/rule?skillId=${skillId}`
              : `/skill/edit/skill/output-yaml-import?skillId=${skillId}`
          }
          showUploadList={false}
          headers={{ token }}
          onChange={onUpload}
        >
          <Button
            icon={<UploadOutlined />}
            style={{
              position: 'relative',
              left: '130px',
            }}
            loading={uploading}
          >
            上传
          </Button>
        </Upload>
      </Modal>
      <Migrate
        skill={skill}
        intents={intents}
        migrateVisible={migrateVisible}
        setMigrateVisible={setMigrateVisible}
      />
      <WordsDrawer
        tableVisible={wordsDrawerVisible}
        setTableVisible={setWordsDrawerVisible}
        createWords={createWords}
        updateWords={updateWords}
        removeWords={removeWords}
        words={words}
        skillId={skillId}
      />
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
      {
        versionItem && (
          <Drawer
            open={versionVisible}
            onClose={closeVersion}
            title={`${versionItem.name} 发布`}
            width={800}
          >
            {versionTableHeader}
            <Table
              dataSource={versionGetDataSource(flow(
                find(propEq('id', versionItem.id)),
                prop('skillVersions'),
              )(skillVersion))}
              columns={versionColumns}
              rowKey="id"
              pagination={versionPagination}
            />
          </Drawer>
        )
      }
    </Layout>
  ) : (
    <Layout>
      <Spin
        style={{
          position: 'relative',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        spinning
      />
    </Layout>
  );
};

result.displayName = __filename;

export default result;
