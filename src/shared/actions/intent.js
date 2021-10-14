import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/intent');

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
  } = {}) => read('/nlu/edit/intent/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/nlu/edit/intent/${id}`),
);

export const create = createAction(
  CREATE,
  ({ name, type, skillId, slots }) => post('/nlu/edit/intent', { name, type, skillId, slots }),
);

export const update = createAction(
  UPDATE,
  ({ id, name, slots }) => put(`/nlu/edit/intent/${id}`, { name, slots }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/nlu/edit/intent/${id}`),
);
