import { merge, handleActions } from 'relient/reducers';
import { builtinIntent } from '../schema';
import {
  READ_ALL,
} from '../actions/builtin-intent';

export default {
  builtinIntent: handleActions({
    [READ_ALL]: merge({
      schema: builtinIntent,
      dataKey: 'data.records',
    }),

  }, {}),
};
