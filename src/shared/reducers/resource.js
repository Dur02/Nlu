import { handleActions, merge, combineActions } from 'relient/reducers';
import {
  UPDATE,
  READ_ALL,
} from '../actions/resource';
import { resource } from '../schema';

export default {
  resource: handleActions({
    [combineActions(
      UPDATE,
    )]: merge({
      schema: resource,
      dataKey: 'data',
    }),

    [READ_ALL]: merge({
      schema: resource,
      dataKey: 'data',
    }),

  }, {}),
};
