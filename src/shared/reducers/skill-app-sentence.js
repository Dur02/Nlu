import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skillAppSentence } from '../schema';
import {
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/skill-app-sentence';

export default {
  skillAppSentence: handleActions({
    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: skillAppSentence,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skillAppSentence),

  }, {}),
};
