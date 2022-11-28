import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skillAppInfo } from '../schema';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/skill-app-info';

export default {
  skillAppInfo: handleActions({
    [READ_ALL]: merge({
      schema: skillAppInfo,
      dataKey: 'data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: skillAppInfo,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skillAppInfo),

  }, {}),
};
