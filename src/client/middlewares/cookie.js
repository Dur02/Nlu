import cookie from 'js-cookie';
import { AUTHORIZATION } from 'shared/constants/cookie';
import {
  LOGIN,
  LOGOUT,
  SET_AUTHORIZATION,
} from 'shared/actions/auth';

export default () => (next) => (action) => {
  const { type } = action;
  if (type === LOGIN) {
    cookie.set(AUTHORIZATION, action.payload.data.token);
  }
  if (type === LOGOUT) {
    cookie.remove(AUTHORIZATION);
  }
  if (type === SET_AUTHORIZATION) {
    cookie.set(AUTHORIZATION, action.payload);
  }
  return next(action);
};
