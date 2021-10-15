import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Empty } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import {
  create as createIntentAction,
  remove as removeIntentAction,
} from 'shared/actions/intent';
import { useAction } from 'relient/actions';

import Intents from './components/intents';
import selector from './skill-editor-selector';
import s from './skill-editor.less';

const { TabPane } = Tabs;

const result = ({ skillId }) => {
  useStyles(s);

  const {
    intents,
    skill,
    builtinIntents,
  } = useSelector(selector(skillId));
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const createIntent = useAction(createIntentAction);
  const removeIntent = useAction(removeIntentAction);

  return (
    <Layout subTitle={skill.name}>
      <div className={s.Container}>
        <Intents
          setSelectedIntentId={setSelectedIntentId}
          createIntent={createIntent}
          skillId={skillId}
          intents={intents}
          builtinIntents={builtinIntents}
          selectedIntentId={selectedIntentId}
          removeIntent={removeIntent}
        />
        <div className={s.Content}>
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
