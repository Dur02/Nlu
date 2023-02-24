import React from 'react';
import { func, number, array } from 'prop-types';
import useStyles from 'isomorphic-style-loader/useStyles';

import IntentSlots from './intent-slots';
import Sentence from './sentence';
import s from './rules.less';

const result = ({
  createRule,
  updateRule,
  removeRule,
  updateIntent,
  createWords,
  updateWords,
  removeWords,
  intentId,
  skillId,
  rules,
  words,
  slots,
}) => {
  useStyles(s);

  return (
    <div className={s.Root}>
      <Sentence
        createRule={createRule}
        updateRule={updateRule}
        removeRule={removeRule}
        intentId={intentId}
        skillId={skillId}
        rules={rules}
        slots={slots}
      />
      <IntentSlots
        updateIntent={updateIntent}
        createWords={createWords}
        updateWords={updateWords}
        removeWords={removeWords}
        intentId={intentId}
        skillId={skillId}
        words={words}
        slots={slots}
      />
    </div>
  );
};

result.displayName = __filename;

result.propTypes = {
  createRule: func.isRequired,
  updateRule: func.isRequired,
  removeRule: func.isRequired,
  createWords: func.isRequired,
  updateWords: func.isRequired,
  removeWords: func.isRequired,
  updateIntent: func.isRequired,
  intentId: number.isRequired,
  skillId: number.isRequired,
  rules: array.isRequired,
  words: array.isRequired,
  slots: array.isRequired,
};

export default result;
