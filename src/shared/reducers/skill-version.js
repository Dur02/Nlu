import { merge, handleActions, combineActions, remove } from 'relient/reducers';
import { prop } from 'lodash/fp';
import { skillVersion } from '../schema';
import {
  READ_ALL,
  CREATE,
  CREATE_DRAFT,
  READ_BY_PRODUCT,
} from '../actions/skill-version';
import {
  READ_ALL as READ_ALL_SKILL,
  REMOVE as REMOVE_SKILL,
  READ_ONE as READ_ONE_SKILL,
  CREATE as CREATE_SKILL,
  UPDATE as UPDATE_SKILL,
} from '../actions/skill';

export default {
  skillVersion: handleActions({
    [combineActions(
      READ_ALL,
      READ_ALL_SKILL,
    )]: merge({
      schema: skillVersion,
      dataKey: 'data.records',
    }),

    [combineActions(
      CREATE,
      READ_ONE_SKILL,
      CREATE_SKILL,
      UPDATE_SKILL,
    )]: merge({
      schema: skillVersion,
      dataKey: 'data',
    }),

    [CREATE_DRAFT]: merge({
      schema: skillVersion,
      dataKey: 'data.newSkill',
    }),

    [READ_BY_PRODUCT]: merge({
      schema: skillVersion,
      preProcess: ({ payload }) => prop('data.skills')(payload) || [],
    }),

    [REMOVE_SKILL]: remove(skillVersion),

  }, {}),
};
