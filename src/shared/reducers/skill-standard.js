import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { skillStandard } from '../schema';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/skill-standard';

export default {
  skillStandard: handleActions({
    [READ_ALL]: merge({
      schema: skillStandard,
      dataKey: 'data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: skillStandard,
      dataKey: 'data',
    }),

    [REMOVE]: remove(skillStandard),

  }, {}),
};
