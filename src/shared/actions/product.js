import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { post } from './request';

const actionType = actionTypeCreator('actions/account');

export const READ_BY_NAME = actionType('READ_BY_NAME');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');

export const readByName = createAction(
  READ_BY_NAME,
  ({
    proName = '',
  } = {}) => post('/nlueditor/selectProductsByName', {
    proName,
  }),
);

export const create = createAction(
  CREATE,
  ({ name, description }) => post('/nlueditor/insertProducts', { name, description }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => post(`/nlueditor/deleteProducts/${id}`),
);
