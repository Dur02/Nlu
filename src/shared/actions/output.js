import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/output');

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
  } = {}) => read('/nlu/edit/output/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/nlu/edit/output/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    intentId,
    component,
    name,
    resource,
    location,
    params,
    response,
  }) => post('/nlu/edit/output', {
    intentId,
    component,
    name,
    resource,
    location,
    params,
    response,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    intentId,
    component,
    name,
    resource,
    location,
    params,
    response,
  }) => put(`/nlu/edit/output/${id}`, {
    intentId,
    component,
    name,
    resource,
    location,
    params,
    response,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/nlu/edit/output/${id}`),
);
