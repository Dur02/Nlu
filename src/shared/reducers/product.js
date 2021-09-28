import { merge, handleActions, remove } from 'relient/reducers';
import { product } from '../schema';
import { READ_BY_NAME, REMOVE } from '../actions/product';

export default {
  product: handleActions({
    [READ_BY_NAME]: merge({
      schema: product,
    }),

    [REMOVE]: remove(product),

  }, {}),
};
