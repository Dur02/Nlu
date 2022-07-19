import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { prop, flatten, flow, map } from 'lodash/fp';
import { intent } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/intent';
import { CREATE_DRAFT, READ_BY_PRODUCT } from '../actions/skill-version';

export default {
  intent: handleActions({
    [READ_ALL]: merge({
      schema: intent,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: intent,
      dataKey: 'data',
    }),

    [CREATE_DRAFT]: merge({
      schema: intent,
      dataKey: 'data.intents',
    }),

    [READ_BY_PRODUCT]: merge({
      schema: intent,
      preProcess: ({ payload }) => flow(
        prop('data.skills'),
        map(prop('intents')),
        flatten,
      )(payload) || [],
    }),

    [REMOVE]: remove(intent),

  }, {}),
};
