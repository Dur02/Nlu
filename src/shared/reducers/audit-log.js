import { handleActions, merge } from 'relient/reducers';
import {
  READ_ALL,
} from '../actions/audit';
import { auditLog } from '../schema';

export default {
  auditLog: handleActions({
    [READ_ALL]: merge({
      schema: auditLog,
      dataKey: 'data.data',
    }),

  }, {}),
};
