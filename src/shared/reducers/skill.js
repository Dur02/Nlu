import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skill } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/skill';

export default {
  skill: handleActions({
    [READ_ALL]: merge({
      schema: skill,
      dataKey: 'data.records',
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
