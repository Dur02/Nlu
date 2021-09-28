import { actionTypeCreator, createAction } from 'relient/actions';
import { post } from './request';

const actionType = actionTypeCreator('actions/auth');

export const LOGIN = actionType('LOGIN');
export const LOGOUT = actionType('LOGOUT');
export const SET_AUTHORIZATION = actionType('SET_AUTHORIZATION');
export const REMOVE_AUTHORIZATION = actionType('REMOVE_AUTHORIZATION');

export const login = createAction(
  LOGIN,
  ({ username, password }) => post(
    '/user/login',
    { username, password },
  ),
  ({ shouldRemember }) => ({ ignoreAuthRedirection: true, shouldRemember }),
);

export const logout = createAction(LOGOUT);

export const setAuthorization = createAction(SET_AUTHORIZATION);

export const removeAuthorization = createAction(REMOVE_AUTHORIZATION);
