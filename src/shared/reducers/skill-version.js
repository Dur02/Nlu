import { merge, handleActions, combineActions } from 'relient/reducers';
import { productVersion } from '../schema';
import {
  READ_ALL,
  CREATE,
} from '../actions/product-version';

export default {
  productVersion: handleActions({
    [READ_ALL]: merge({
      schema: productVersion,
      dataKey: 'data.records',
    }),

    [combineActions(
      CREATE,
    )]: merge({
      schema: productVersion,
      dataKey: 'data',
    }),

  }, {}),
};
