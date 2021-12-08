import { merge, handleActions, combineActions } from 'relient/reducers';
import { skillVersion } from '../schema';
import {
  READ_ALL,
  CREATE,
  CREATE_DRAFT,
} from '../actions/skill-version';

export default {
  skillVersion: handleActions({
    [READ_ALL]: merge({
      schema: skillVersion,
      dataKey: 'data.records',
    }),

    [combineActions(
      CREATE,
      CREATE_DRAFT,
    )]: merge({
      schema: skillVersion,
      dataKey: 'data',
    }),

  }, {}),
};
