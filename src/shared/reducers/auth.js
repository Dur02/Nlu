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
    [LOGIN]: (auth, { payload }) => ({
      ...auth,
      isLogin: true,
      authorization: payload.data.token,
      currentUserId: payload.data.id,
    }),

    [READ_MINE]: (auth, { payload: { data: { id } } }) => ({
      ...auth,
      currentUserId: id,
      isLogin: true,
    }),

    [LOGOUT]: () => ({
      isLogin: false,
      authorization: null,
      currentUserId: null,
    }),

    [SET_AUTHORIZATION]: (auth, { payload }) => ({
      ...auth,
      authorization: payload,
    }),

    [REMOVE_AUTHORIZATION]: (auth) => ({ ...auth, authorization: null }),

  }, {
    authorization: null,
    isLogin: false,
    currentUserId: null,
  }),
};
