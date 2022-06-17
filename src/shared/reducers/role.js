import { handleActions, merge, combineActions, remove } from 'relient/reducers';
import {
  UPDATE,
  REMOVE,
  CREATE,
  READ_ALL,
} from '../actions/role';
import { role } from '../schema';

export default {
  role: handleActions({
    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: role,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: role,
      dataKey: 'data',
    }),

    [REMOVE]: remove(role),

  }, {}),
};
