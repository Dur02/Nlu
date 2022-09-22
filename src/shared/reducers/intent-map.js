import { handleActions, merge, combineActions, remove } from 'relient/reducers';
import {
  UPDATE,
  REMOVE,
  CREATE,
  READ_ALL,
} from '../actions/intent-map';
import { intentMap } from '../schema';

export default {
  intentMap: handleActions({
    [combineActions(
      UPDATE,
      CREATE,
    )]: merge({
      schema: intentMap,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: intentMap,
      dataKey: 'data.records',
    }),

    [REMOVE]: remove(intentMap),

  }, {}),
};
