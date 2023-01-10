import { handleActions, merge, combineActions, remove } from 'relient/reducers';
import {
  UPDATE,
  REMOVE,
  CREATE,
  READ_ALL,
} from '../actions/skill-name-map';
import { skillNameMap } from '../schema';

export default {
  skillNameMap: handleActions({
    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: skillNameMap,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: skillNameMap,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skillNameMap),

  }, {}),
};
