import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skill } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/skill';
import {
  CREATE_DRAFT,
} from '../actions/skill-version';

export default {
  skill: handleActions({
    [READ_ALL]: merge({
      schema: skill,
      dataKey: 'data.records',
    }),

    [CREATE_DRAFT]: (state, { meta: { skillId } }) => ({
      [skillId]: {
        ...state[skillId],
        isDraft: 0,
      },
      ...state,
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: skill,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skill),

  }, {}),
};
