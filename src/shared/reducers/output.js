import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { output } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
} from '../actions/output';
import { CREATE_DRAFT } from '../actions/skill-version';

export default {
  output: handleActions({
    [READ_ALL]: merge({
      schema: output,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: output,
      dataKey: 'data',
    }),

    [CREATE_DRAFT]: merge({
      schema: output,
      dataKey: 'data.outputs',
    }),

    [REMOVE]: remove(output),

  }, {}),
};
