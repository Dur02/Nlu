import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { intent } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/intent';
import { CREATE_DRAFT } from '../actions/skill-version';

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

    [REMOVE]: remove(intent),

  }, {}),
};
