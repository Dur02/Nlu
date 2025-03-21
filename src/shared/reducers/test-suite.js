import { combineActions, handleActions, merge, remove } from 'relient/reducers';
import {
  READ_ALL,
  REMOVE,
  CREATE,
  UPDATE,
  CASE_ADD,
  CASE_DEL,
  CASE_REPLACE,
} from '../actions/test-suite';
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
      CASE_ADD,
      CASE_DEL,
      CASE_REPLACE,
    )]: merge({
      schema: testSuite,
      dataKey: 'data',
    }),

    [REMOVE]: remove(testSuite),

  }, {}),
};
