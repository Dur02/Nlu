import { merge, handleActions, remove, combineActions } from 'relient/reducers';
import { reject, includes } from 'lodash/fp';
import { product } from '../schema';
import {
  READ_ALL,
  REMOVE,
  READ_ONE,
  CREATE,
  UPDATE,
  ATTACH_SKILLS,
  DETACH_SKILLS,
} from '../actions/product';

export default {
  product: handleActions({
    [READ_ALL]: merge({
      schema: product,
      dataKey: 'data.records',
    }),

    [combineActions(
      READ_ONE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: product,
      dataKey: 'data',
    }),

    [ATTACH_SKILLS]: (state, { meta: { id, skillInfos } }) => ({
      ...state,
      [id]: {
        ...state[id],
        skillIds: [skillInfos.skillId, ...state[id].skillIds],
      },
    }),

    [DETACH_SKILLS]: (state, { meta: { id, skillIds } }) => ({
      ...state,
      [id]: {
        ...state[id],
        skillIds: reject((skillId) => includes(skillId)(skillIds))(state[id].skillIds),
      },
    }),

    [REMOVE]: remove(product),

  }, {}),
};
