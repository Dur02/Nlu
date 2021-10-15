import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { rule } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/rule';

export default {
  rule: handleActions({
    [READ_ALL]: merge({
      schema: rule,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: rule,
      dataKey: 'data',
    }),

    [REMOVE]: remove(rule),

  }, {}),
};
