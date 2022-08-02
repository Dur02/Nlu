import { combineActions, handleActions, merge, remove } from 'relient/reducers';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
} from '../actions/testSuite';
import { testSuite } from '../schema';

export default {
  testSuite: handleActions({
    [READ_ALL]: merge({
      schema: testSuite,
      dataKey: 'data.data',
    }),

    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: testSuite,
      dataKey: 'data',
    }),

    [REMOVE]: remove(testSuite),

  }, {}),
};
