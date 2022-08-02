import { combineActions, handleActions, merge, remove } from 'relient/reducers';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/testCase';
import { testCase } from '../schema';

export default {
  testCase: handleActions({
    [READ_ALL]: merge({
      schema: testCase,
      dataKey: 'data.data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: testCase,
      dataKey: 'data',
    }),

    [REMOVE]: remove(testCase),

  }, {}),
};
