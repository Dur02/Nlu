import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skillAppInfo, skillAppSentence } from '../schema';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/skill-app-sentence';

export default {
  skillAppSentence: handleActions({
    [READ_ALL]: merge({
      schema: skillAppInfo,
      dataKey: 'data',
    }),

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
