import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skillStandardSentence } from '../schema';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/skill-standard-sentence';

export default {
  skillStandardSentence: handleActions({
    [READ_ALL]: merge({
      schema: skillStandardSentence,
      dataKey: 'data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: skillStandardSentence,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skillStandardSentence),

  }, {}),
};
