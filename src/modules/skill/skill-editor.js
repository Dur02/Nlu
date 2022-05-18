import React, { useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Empty, Input, message, Modal, Button } from 'antd';
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
import { find, propEq, flow, prop, eq, flatten } from 'lodash/fp';
import {
  readAll as readAllOutputAction,
  update as updateOutputAction,
} from 'shared/actions/output';

import Rules from './components/rules';
import Intents from './components/intents';
import Output from './components/output';
import selector from './skill-editor-selector';
import s from './skill-editor.less';
import WordGraph from '../../shared/components/word-graph';
import GlobalSearchRules from './components/globalSearchRules';

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
  } = useSelector(selector(skillId));
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [intentNameText, setIntentNameText] = useState('');
  const selectedIntent = find(propEq('id', selectedIntentId))(intents);
  const selectedOutput = find(propEq('intentId', selectedIntentId))(outputs);
  const globalRules = flatten(intents.map(
    (item) => {
      const i = item.rules.map(
        (item2) => {
          const j = item2;
          j.name = item.name;
          j.intentId = item.id;
          return j;
        },
      );
      return i;
    },
  ));

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
  return (
    <Layout
      subTitle={skill.name}
      addonAfter={(
        <>
          <Button type="primary" onClick={() => setGlobalSearch(true)}>全局说法搜索</Button>
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
      >
        <WordGraph skillCode={skill.code} />
      </Modal>
      <Modal
        visible={globalSearch}
        onCancel={() => setGlobalSearch(false)}
        title="全局搜索"
        width={800}
        footer={null}
        destroyOnClose="true"
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
    </Layout>
  );
};

result.displayName = __filename;

export default result;
