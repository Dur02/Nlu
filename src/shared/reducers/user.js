import { handleActions, merge } from 'relient/reducers';
import {
  READ_MINE,
} from '../actions/user';
import { user } from '../schema';

export default {
  user: handleActions({
    [READ_MINE]: merge({
      schema: user,
    }),

  }, {}),
};
