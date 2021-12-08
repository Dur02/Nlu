import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { rule } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/rule';
import { CREATE_DRAFT } from '../actions/skill-version';

export default {
  rule: handleActions({
    [READ_ALL]: merge({
      schema: rule,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: rule,
      dataKey: 'data',
    }),

    [CREATE_DRAFT]: merge({
      schema: rule,
      dataKey: 'data.rules',
    }),

    [REMOVE]: remove(rule),

  }, {}),
};
