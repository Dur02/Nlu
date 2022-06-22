import { handleActions, merge } from 'relient/reducers';
import {
  READ_ALL_RESOURCE_TYPE,
} from '../actions/audit';
import { auditResourceType } from '../schema';

export default {
  auditResourceType: handleActions({
    [READ_ALL_RESOURCE_TYPE]: merge({
      schema: auditResourceType,
      dataKey: 'data',
    }),

  }, {}),
};
