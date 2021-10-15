import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Menu, message, Input, Dropdown, Button } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, filter, identity, includes, every, size, startsWith, find, propEq } from 'lodash/fp';
import { SEMANTIC } from 'shared/constants/intent-type';

import s from './intents.less';

const { Item } = Menu;
const { Search } = Input;

const result = ({
  createIntent,
  intents,
  builtinIntents,
  selectedIntentId,
  setSelectedIntentId,
  skillId,
}) => {
  useStyles(s);

  const [intentSearchText, setIntentSearchText] = useState(null);
  const onIntentClick = useCallback(({ key }) => setSelectedIntentId(key), []);
  const onAddIntentClick = useCallback(async ({ key }) => {
    let data;
    if (key === SEMANTIC) {
      const sameNameIntentSize = flow(
        filter(({ name }) => startsWith('自定义意图')(name)),
        size,
      )(intents);
      data = {
        name: `自定义意图${sameNameIntentSize ? sameNameIntentSize + 1 : 1}`,
        type: SEMANTIC,
        skillId,
      };
    } else {
      const builtinIntent = find(propEq('id', key))(builtinIntents);
      data = {
        name: builtinIntent.name,
        type: builtinIntent.type,
        skillId,
      };
    }
    const { data: { id } } = await createIntent(data);
    setSelectedIntentId(id);
    message.success('创建成功');
  }, [skillId]);

  const intentOptions = (
    <Menu onClick={onAddIntentClick}>
      <Item key={SEMANTIC}>
        自定义意图
      </Item>
      <Item key="tips" disabled>
        内置意图
      </Item>
      {flow(
        filter(({ name }) => every((intent) => intent.name !== name)(intents)),
        map(({ name, id }) => (
          <Item key={id}>
            {name}
          </Item>
        )),
      )(builtinIntents)}
    </Menu>
  );

  return (
    <div>
      <div className={s.Header}>
        <Dropdown overlay={intentOptions}>
          <Button type="primary">添加意图</Button>
        </Dropdown>
        <Search
          placeholder="输入意图名称搜索"
          allowClear
          onSearch={setIntentSearchText}
          className={s.Search}
        />
      </div>
      <Menu
        onClick={onIntentClick}
        selectedKeys={[selectedIntentId && selectedIntentId.toString()]}
      >
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
  );
};

result.displayName = __filename;

result.propTypes = {
  createIntent: func.isRequired,
  skillId: number.isRequired,
  intents: array.isRequired,
  builtinIntents: array.isRequired,
  selectedIntentId: number,
  setSelectedIntentId: func.isRequired,
};

export default result;
