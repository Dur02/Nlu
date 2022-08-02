import { combineActions, handleActions, merge, remove } from 'relient/reducers';
import {
  READ_ALL,
  CANCEL,
  CREATE,
  UPDATE,
} from '../actions/testJob';
import { testJob } from '../schema';

export default {
  testJob: handleActions({
    [READ_ALL]: merge({
      schema: testJob,
      dataKey: 'data.data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: testJob,
      dataKey: 'data',
    }),

    [CANCEL]: remove(testJob),

  }, {}),
};
