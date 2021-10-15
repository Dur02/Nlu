import React, { useCallback, useState } from 'react';
import { func, number, array } from 'prop-types';
import { Input, message } from 'antd';
import { map } from 'lodash/fp';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './rules.less';

const { Search } = Input;

const result = ({
  createRule,
  intentId,
  rules,
}) => {
  useStyles(s);

  const [newSentence, setNewSentence] = useState('');
  const onChangeSentence = useCallback(
    ({ target: { value } }) => setNewSentence(value),
    [],
  );
  const onCreateRule = useCallback(async () => {
    await createRule({ intentId, sentence: newSentence });
    message.success('添加说法成功，请设置槽位');
    setNewSentence('');
  }, [newSentence, intentId]);

  return (
    <div className={s.Root}>
      <div className={s.Rules}>
        <Search
          onSearch={onCreateRule}
          onChange={onChangeSentence}
          value={newSentence}
          placeholder="清输入说法"
          enterButton="添加"
        />
        <div>
          {map(({ sentence }) => sentence)(rules)}
        </div>
      </div>
      <div className={s.Words}>
        词库
      </div>
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  createRule: func.isRequired,
  updateRule: func.isRequired,
  removeRule: func.isRequired,
  intentId: number.isRequired,
  rules: array.isRequired,
};

export default result;
