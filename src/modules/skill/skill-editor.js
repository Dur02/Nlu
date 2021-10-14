import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import Layout from 'shared/components/layout';
import { Tabs, Menu, Empty, Input } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, filter, identity, includes } from 'lodash/fp';

import selector from './skill-editor-selector';
import s from './skill-editor.less';

const { TabPane } = Tabs;
const { Item } = Menu;
const { Search } = Input;

const result = ({ skillId }) => {
  useStyles(s);

  const {
    intents,
    skill,
  } = useSelector(selector(skillId));
  const [selectedIntentId, setSelectedIntentId] = useState(null);
  const [intentSearchText, setIntentSearchText] = useState(null);
  const onIntentClick = useCallback(({ key }) => setSelectedIntentId(key), []);

  return (
    <Layout subTitle={skill.name}>
      <div className={s.Container}>
        <div>
          <Search
            placeholder="输入意图名称搜索"
            allowClear
            onSearch={setIntentSearchText}
            className={s.Search}
          />
          <Menu onClick={onIntentClick}>
            {flow(
              intentSearchText
                ? filter(({ name }) => includes(intentSearchText)(name))
                : identity,
              map(({ name, id }) => (
                <Item key={id}>
                  {name}
                </Item>
              )),
            )(intents)}
          </Menu>
        </div>
        <div className={s.Content}>
          {selectedIntentId ? (
            <Tabs>
              <TabPane tab="说法" key="1">
                说法
              </TabPane>
              <TabPane tab="发布" key="2">
                发布
              </TabPane>
              <TabPane tab="发布" key="3">
                发布
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
