import cookie from 'js-cookie';
import { AUTHORIZATION } from 'shared/constants/cookie';
import {
  LOGOUT,
} from 'shared/actions/auth';

export default () => (next) => (action) => {
  const { type } = action;
  if (type === LOGOUT) {
    cookie.remove(AUTHORIZATION);
  }
  return next(action);
};
