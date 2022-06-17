import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, post, put, del } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/role');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const UPDATE = actionType('UPDATE');
export const REMOVE = actionType('REMOVE');

export const readAll = createAction(
  READ_ALL,
  () => read('/skill/edit/role'),
);

export const create = createAction(
  CREATE,
  ({
    name,
    resourceIds,
  }) => post('/skill/edit/role', {
    name,
    resourceIds,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    resourceIds,
  }) => put('/skill/edit/role', {
    id,
    name,
    resourceIds,
  }),
);

export const remove = createAction(
  REMOVE,
  ({
    id,
  }) => del('/skill/edit/role', {
    id,
  }),
);
