import { merge, handleActions } from 'relient/reducers';
import { product } from '../schema';
import { READ_BY_NAME } from '../actions/product';

export default {
  product: handleActions({
    [READ_BY_NAME]: merge({
      schema: product,
    }),

  }, {}),
};
