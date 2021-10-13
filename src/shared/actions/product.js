import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/product');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  ({
    current = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/nlu/edit/product/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/nlu/edit/product/${id}`),
);

export const create = createAction(
  CREATE,
  ({ name, description }) => post('/nlu/edit/product', { name, description }),
);

export const update = createAction(
  UPDATE,
  ({ id, name, description }) => put(`/nlu/edit/product/${id}`, { name, description }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/nlu/edit/product/${id}`),
);
