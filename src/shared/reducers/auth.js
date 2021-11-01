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
    [LOGIN]: (auth) => ({
      ...auth,
      isLogin: true,
    }),

    [READ_MINE]: (auth, { payload: { data: { username } } }) => ({
      ...auth,
      currentAccountId: username,
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
