import { actionTypeCreator, createAction } from 'relient/actions';
import { post, read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/auth');

export const LOGIN = actionType('LOGIN');
export const LOGOUT = actionType('LOGOUT');
export const SET_AUTHORIZATION = actionType('SET_AUTHORIZATION');
export const REMOVE_AUTHORIZATION = actionType('REMOVE_AUTHORIZATION');
export const READ_QR_IMAGE = actionType('READ_QR_IMAGE');
export const QR_LOGIN = actionType('QR_LOGIN');

export const login = createAction(
  LOGIN,
  ({ username, password }) => post(
    '/skill/edit/user/login',
    { account: username, password },
  ),
  ({ shouldRemember }) => ({ ignoreAuthRedirection: true, shouldRemember }),
);

export const readQRImage = createAction(
  READ_QR_IMAGE,
  () => read('/skill/edit/mfa/qr-code'),
);

export const qrLogin = createAction(
  QR_LOGIN,
  ({ code }) => post(`/skill/edit/mfa/login?code=${code}`),
);

export const logout = createAction(LOGOUT);

export const setAuthorization = createAction(SET_AUTHORIZATION);

export const removeAuthorization = createAction(REMOVE_AUTHORIZATION);
