import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { output } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/output';

export default {
  output: handleActions({
    [READ_ALL]: merge({
      schema: output,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: output,
      dataKey: 'data',
    }),

    [REMOVE]: remove(output),

  }, {}),
};
