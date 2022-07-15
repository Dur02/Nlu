import { handleActions, merge, combineActions, remove } from 'relient/reducers';
import {
  UPDATE,
  REMOVE,
  CREATE,
  READ_ALL,
} from '../actions/intervention';
import { intervention } from '../schema';

export default {
  intervention: handleActions({
    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: intervention,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: intervention,
      dataKey: 'data.records',
    }),

    [REMOVE]: remove(intervention),

  }, {}),
};
