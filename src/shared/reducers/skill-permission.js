import { handleActions, merge, combineActions } from 'relient/reducers';
import {
  UPDATE,
  READ_ALL,
} from '../actions/skill-permission';
import { skillPermission } from '../schema';

export default {
  skillPermission: handleActions({
    [combineActions(
      UPDATE,
    )]: merge({
      schema: skillPermission,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: skillPermission,
      dataKey: 'data.records',
    }),

  }, {}),
};
