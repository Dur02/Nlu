import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Empty, Input, message } from 'antd';
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
import { find, propEq, flow, prop, eq } from 'lodash/fp';
import {
  readAll as readAllOutputAction,
  update as updateOutputAction,
} from 'shared/actions/output';

import Rules from './components/rules';
import Intents from './components/intents';
import Output from './components/output';
import selector from './skill-editor-selector';
import s from './skill-editor.less';

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

  const createIntent = useAction(createIntentAction);
  const removeIntent = useAction(removeIntentAction);
  const updateIntent = useAction(updateIntentAction);
  const createRule = useAction(createRuleAction);
  const removeRule = useAction(removeRuleAction);
  const updateRule = useAction(updateRuleAction);
  const createWords = useAction(createWordsAction);
  const removeWords = useAction(removeWordsAction);
  const updateWords = useAction(updateWordsAction);
  const readAllOutput = useAction(readAllOutputAction);
  const updateOutput = useAction(updateOutputAction);

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
      eq(setIntentNameText),
    )(selectedIntent)) {
      await updateIntent({ name: intentNameText, id: selectedIntent.id });
      message.success('编辑意图名称成功');
    }
  }, [intentNameText, selectedIntent]);

  return (
    <Layout subTitle={skill.name}>
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
          {selectedIntentId && (
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
          {selectedIntentId ? (
            <Tabs>
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
                />
              </TabPane>
            </Tabs>
          ) : (<Empty description="请选择意图" />)}
        </div>
      </div>
    </Layout>
  );
};

result.displayName = __filename;

export default result;
