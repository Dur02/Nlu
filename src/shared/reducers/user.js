import { handleActions, merge, combineActions } from 'relient/reducers';
import { map, prop, flow } from 'lodash/fp';
import {
  READ_MINE,
  UPDATE_MINE,
  UPDATE,
  UPDATE_ROLE,
  CREATE,
  READ_ALL,
} from '../actions/user';
import { user } from '../schema';

export default {
  user: handleActions({
    [combineActions(
      READ_MINE,
      UPDATE_MINE,
      UPDATE,
      CREATE,
    )]: merge({
      schema: user,
      dataKey: 'data',
      processValue: ({ value }) => ({
        ...value,
        roleIds: flow(prop('roles'), map(prop('id')))(value),
      }),
    }),

    [READ_ALL]: merge({
      schema: user,
      dataKey: 'data.records',
      processValue: ({ value }) => ({
        ...value,
        roleIds: flow(prop('roles'), map(prop('id')))(value),
      }),
    }),

    [UPDATE_ROLE]: merge({
      schema: user,
      preProcess: ({ meta }) => ({
        id: meta.id,
        roleIds: meta.roleIds,
      }),
    }),

  }, {}),
};
