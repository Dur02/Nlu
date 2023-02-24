import React, { useCallback, useState } from 'react';
import {
  Input, message,
} from 'antd';
import useStyles from 'isomorphic-style-loader/useStyles';
import { eq, flow, prop } from 'lodash/fp';
import s from './intent-name-input.less';

const { Search } = Input;

const result = ({
  intentNameText,
  selectedIntent,
  updateIntent,
}) => {
  useStyles(s);

  const [name, setName] = useState(intentNameText);

  const onChangeIntentNameText = useCallback(({ target: { value } }) => {
    setName(value);
  }, [intentNameText, name]);

  const onSaveIntentNameText = useCallback(async () => {
    if (!flow(
      prop('name'),
      eq(name),
    )(selectedIntent)) {
      await updateIntent({ name, id: selectedIntent.id });
      message.success('编辑意图名称成功');
    }
  }, [intentNameText, selectedIntent, name]);

  return (
    <div className={s.IntentNameWrapper}>
      当前意图名称：
      <Search
        onSearch={onSaveIntentNameText}
        onChange={onChangeIntentNameText}
        value={name}
        className={s.IntentNameInput}
        enterButton="保存"
        // readOnly={selectedIntent.type !== SEMANTIC}
      />
    </div>
  );
};

result.displayName = __filename;

export default result;
