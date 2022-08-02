import { handleActions, merge } from 'relient/reducers';
import {
  READ_ALL,
} from '../actions/testJobResult';
import { testJobResult } from '../schema';

export default {
  testJobResult: handleActions({
    [READ_ALL]: merge({
      schema: testJobResult,
      dataKey: 'data.data',
    }),
  }, {}),
};
