import { combineActions, handleActions, merge } from 'relient/reducers';
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
      CANCEL,
    )]: merge({
      schema: testJob,
      dataKey: 'data',
    }),

  }, {}),
};
