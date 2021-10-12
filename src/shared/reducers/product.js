import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { product } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/product';

export default {
  product: handleActions({
    [READ_ALL]: merge({
      schema: product,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: product,
      dataKey: 'data',
    }),

    [REMOVE]: remove(product),

  }, {}),
};
