import { handleActions } from 'relient/reducers';
import {
  LOGIN,
  SET_AUTHORIZATION,
  REMOVE_AUTHORIZATION,
  LOGOUT,
} from '../actions/auth';
import { READ_MINE } from '../actions/user';

export default {
  auth: handleActions({
    [LOGIN]: () => ({
      isLogin: true,
    }),

    [READ_MINE]: () => ({
      isLogin: true,
    }),

    [LOGOUT]: () => ({
      isLogin: false,
      authorization: null,
      currentAccountId: null,
    }),

    [SET_AUTHORIZATION]: (auth, { payload }) => ({
      ...auth,
      authorization: payload,
    }),

    [REMOVE_AUTHORIZATION]: (auth) => ({ ...auth, authorization: null }),

  }, {
    authorization: null,
    isLogin: false,
    currentAccountId: null,
  }),
};
