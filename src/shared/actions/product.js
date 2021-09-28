import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { post } from './request';

const actionType = actionTypeCreator('actions/account');

export const READ_BY_NAME = actionType('READ_BY_NAME');

export const readByName = createAction(
  READ_BY_NAME,
  ({
    proName = '',
  } = {}) => post('/nlueditor/selectProductsByName', {
    proName,
  }),
);
