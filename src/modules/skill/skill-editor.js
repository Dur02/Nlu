import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Empty, Input, message, Modal, Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useStyles from 'isomorphic-style-loader/useStyles';
import { SEMANTIC } from 'shared/constants/intent-type';
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
import { outputYamlExport } from 'shared/actions/skill';
import Rules from './components/rules';
import Intents from './components/intents';
import Output from './components/output';
import selector from './skill-editor-selector';
import s from './skill-editor.less';
import WordGraph from '../../shared/components/word-graph';
import GlobalSearchRules from './components/global-search-rules';

const { TabPane } = Tabs;
const { Search } = Input;

const result = ({ skillId }) => {
  useStyles(s);

  const {
    intents,
    skill,
    builtinIntents,
    words,
    outputs,
    token,
  } = useSelector(selector(skillId));
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [intentNameText, setIntentNameText] = useState('');
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
  }, []);
  const onChangeIntentNameText = useCallback(
    ({ target: { value } }) => setIntentNameText(value),
    [],
  );
  const onSaveIntentNameText = useCallback(async () => {
    if (!flow(
      prop('name'),
      eq(intentNameText),
    )(selectedIntent)) {
      await updateIntent({ name: intentNameText, id: selectedIntent.id });
      message.success('编辑意图名称成功');
    }
  }, [intentNameText, selectedIntent]);

  const [wordGraphVisible, setWordGraphVisible] = useState(false);
  const [globalSearch, setGlobalSearch] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [textAreaVisible, setTextAreaVisible] = useState(false);

  const closeUpload = useCallback(() => {
    setUploadVisible(false);
  }, [uploadVisible, setUploadVisible]);

  const closeTextArea = useCallback(() => {
    setTextAreaVisible(false);
  }, [textAreaVisible, setTextAreaVisible]);

  const [uploading, setUploading] = useState(false);
  const onUpload = useCallback(async ({ file: { status, response } }) => {
    setUploading(true);
    if (status === 'done') {
      if (response.code === 'SUCCESS') {
        message.success('检查完成，测试文件格式正确,即将刷新数据');
        window.location.reload();
      } else if (response.data && response.data.length > 0) {
        flow(
          map(prop('errorMsg')),
          join('，'),
          message.error,
        )(response.data);
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
  }, []);

  return (
    <Layout
      subTitle={`${skill.name}  (${skill.version})  `}
      addonAfter={(
        <>
          <Button type="primary" onClick={() => setUploadVisible(true)}>纯文本导入</Button>
          &nbsp;
          <Button type="primary" onClick={() => setUploadVisible(true)}>技能回复导入</Button>
          &nbsp;
          <Button
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
                  `${skill.name}(技能回复)-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.yml`,
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
          &nbsp;
          <Button type="primary" onClick={() => setGlobalSearch(true)}>全局说法检索</Button>
          &nbsp;
          <Button type="primary" onClick={() => setWordGraphVisible(true)}>词图</Button>
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
                readOnly={selectedIntent.type !== SEMANTIC}
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
        <WordGraph skillCode={skill.code} />
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
        title="回复数据导入"
        width={400}
      >
        <Upload
          name="file"
          action={() => `/skill/edit/skill/output-yaml-import?skillId=${skillId}`}
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
      <Modal
        visible={textAreaVisible}
        onCancel={closeTextArea}
        footer={null}
        title="纯文本数据导入"
        width={400}
      >
        <Upload
          name="file"
          action={() => `/skill/edit/skill/excel-import/rule?skillId=${skillId}`}
          showUploadList={false}
          headers={{ token }}
          onChange={onUpload}
        >
          <Button
            icon={<UploadOutlined />}
            style={{
              position: 'relative',
              left: '90px',
            }}
            loading={uploading}
          >
            上传
          </Button>
        </Upload>
      </Modal>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
