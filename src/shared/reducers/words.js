import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { words } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/product';

export default {
  words: handleActions({
    [READ_ALL]: merge({
      schema: words,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: words,
      dataKey: 'data',
    }),

    [REMOVE]: remove(words),

  }, {}),
};
