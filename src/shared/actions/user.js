import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/user');

export const READ_MINE = actionType('READ_MINE');
export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const UPDATE = actionType('UPDATE');
export const UPDATE_ROLE = actionType('UPDATE_ROLE');
export const UPDATE_MINE = actionType('UPDATE_MINE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    limit = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/admin/user', { page, limit }),
);

export const readMine = createAction(
  READ_MINE,
  () => read('/skill/edit/user/info'),
);

export const updateMine = createAction(
  UPDATE_MINE,
  ({
    id,
    openMfa,
    password,
    status,
  }) => put('/skill/edit/user/info', {
    id,
    openMfa,
    password,
    status,
  }),
);

export const create = createAction(
  CREATE,
  ({
    name,
    openMfa,
    password,
    roleIds,
  }) => post('/skill/edit/admin/user', {
    name,
    openMfa,
    password,
    roleIds,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    openMfa,
    password,
    status,
    roleIds,
  }) => put('/skill/edit/admin/user', {
    id,
    openMfa,
    password,
    status,
    roleIds,
  }),
);

export const updateRole = createAction(
  UPDATE_ROLE,
  ({
    id,
    roleIds,
  }) => put('/skill/edit/admin/role', {
    userId: id,
    roleIds,
  }),
);
