import React, { useCallback, useState } from 'react';
import { array, func, number } from 'prop-types';
import { Menu, message, Input, Dropdown, Button, Popconfirm } from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { map, flow, filter, identity, includes, every, size, find, propEq, prop } from 'lodash/fp';
import { SEMANTIC } from 'shared/constants/intent-type';

import { useAction } from 'relient/actions';
import { push as pushAction } from 'relient/actions/history';
import s from './intents.less';

const { Item } = Menu;
const { Search } = Input;

const result = ({
  createIntent,
  removeIntent,
  readAllOutput,
  intents,
  builtinIntents,
  intentId,
  onChangeIntentId,
  skillId,
}) => {
  useStyles(s);

  const [intentSearchText, setIntentSearchText] = useState(null);
  const onIntentClick = useCallback(
    ({ key }) => {
      if (key !== '') {
        const id = Number(key);
        onChangeIntentId({
          id,
          name: flow(find(propEq('id', id)), prop('name'))(intents),
        });
      } else {
        onChangeIntentId();
      }
    },
    [onChangeIntentId, intents],
  );
  const onCreateIntent = useCallback(async ({ key }) => {
    let data;
    if (key === SEMANTIC) {
      let name = '自定义意图';
      let count = 1;
      while (find(propEq('name', name))(intents) && count <= 99999) {
        name = `自定义意图${count}`;
        count += 1;
      }
      data = {
        name,
        type: SEMANTIC,
        skillId,
      };
    } else {
      const builtinIntent = find(propEq('id', Number(key)))(builtinIntents);
      data = {
        name: builtinIntent.name,
        type: builtinIntent.type,
        skillId,
      };
    }
    const { data: { id, name } } = await createIntent(data);
    await readAllOutput({ intentId: id });
    onChangeIntentId({ id, name });
    message.success('创建成功');
  }, [skillId, onChangeIntentId, intents]);
  const onRemoveIntent = useCallback(async (id) => {
    await removeIntent({ id });
    message.success('删除成功');
    onChangeIntentId({ id: null, name: '' });
  }, [onChangeIntentId]);

  const availableBuiltinIntents = filter(
    ({ name }) => every((intent) => intent.name !== name)(intents),
  )(builtinIntents);

  const push = useAction(pushAction);

  const intentOptions = (
    <Menu onClick={onCreateIntent}>
      <Item key={SEMANTIC}>
        自定义意图
      </Item>
      <Item key="tips" disabled>
        {size(availableBuiltinIntents) > 0 ? '内置意图' : '无可用内置意图'}
      </Item>
      {map(({ name, id }) => (
        <Item key={id}>
          {name}
        </Item>
      ))(availableBuiltinIntents)}
    </Menu>
  );

  return (
    <div className={s.Root}>
      <div className={s.Header}>
        <Dropdown overlay={intentOptions}>
          <Button type="primary">添加意图</Button>
        </Dropdown>
        <Search
          placeholder="按名称搜索"
          allowClear
          onChange={({ target }) => setIntentSearchText(target.value)}
          className={s.Search}
        />
      </div>
      <Button onClick={() => push('/skill/822')}>随便</Button>
      <Menu
        onClick={onIntentClick}
        selectedKeys={[intentId && intentId.toString()]}
        className={s.Menu}
      >
        {flow(
          intentSearchText
            ? filter(({ name }) => includes(intentSearchText)(name))
            : identity,
          map(({ name, id }) => (
            <Item key={id}>
              <div className={s.Intent}>
                {name}
                <Popconfirm
                  title="确认删除吗？删除操作不可恢复，包括说法、对话都会被清空"
                  onConfirm={() => onRemoveIntent(id)}
                >
                  <Button ghost size="small" danger>删除</Button>
                </Popconfirm>
              </div>
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
  removeIntent: func.isRequired,
  readAllOutput: func.isRequired,
  skillId: number.isRequired,
  intents: array.isRequired,
  builtinIntents: array.isRequired,
  intentId: number,
  onChangeIntentId: func.isRequired,
};

export default result;
