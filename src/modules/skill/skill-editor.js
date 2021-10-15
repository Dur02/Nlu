import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Empty, Input, message, Form } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import {
  create as createIntentAction,
  remove as removeIntentAction,
  update as updateIntentAction,
} from 'shared/actions/intent';
import { useAction } from 'relient/actions';
import { find, propEq, flow, prop, eq } from 'lodash/fp';

import Intents from './components/intents';
import selector from './skill-editor-selector';
import s from './skill-editor.less';

const { TabPane } = Tabs;
const { Item } = Form;
const { Search } = Input;

const result = ({ skillId }) => {
  useStyles(s);

  const {
    intents,
    skill,
    builtinIntents,
  } = useSelector(selector(skillId));
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [intentNameText, setIntentNameText] = useState('');
  const createIntent = useAction(createIntentAction);
  const removeIntent = useAction(removeIntentAction);
  const updateIntent = useAction(updateIntentAction);
  const onChangeIntentId = useCallback((id) => {
    setSelectedIntentId(id);
    flow(
      find(propEq('id', id)),
      prop('name'),
      setIntentNameText,
    )(intents);
  }, [intents]);
  const onChangeIntentNameText = useCallback(
    ({ target: { value } }) => setIntentNameText(value),
    [],
  );
  const onSaveIntentNameText = useCallback(async () => {
    if (!flow(
      find(propEq('id', selectedIntentId)),
      prop('name'),
      eq(setIntentNameText),
    )(intents)) {
      await updateIntent({ name: intentNameText, id: selectedIntentId });
      message.success('编辑意图名称成功');
    }
  }, [intentNameText, selectedIntentId]);

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
        />
        <div className={s.Content}>
          {selectedIntentId && (
            <Item
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 8 }}
              label="当前意图名称"
            >
              <Search
                onSearch={onSaveIntentNameText}
                onChange={onChangeIntentNameText}
                value={intentNameText}
                className={s.IntentNameInput}
                enterButton="保存"
              />
            </Item>
          )}
          {selectedIntentId ? (
            <Tabs>
              <TabPane tab="说法" key="1">
                说法
              </TabPane>
              <TabPane tab="对话" key="2">
                对话
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
