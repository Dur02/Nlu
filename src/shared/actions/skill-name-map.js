import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-name-map');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const READ_CONFIG = actionType('READ_CONFIG');

export const readAll = createAction(
  READ_ALL,
  () => read('/skill/edit/skill-name-map/list'),
);

export const create = createAction(
  CREATE,
  ({
    appId,
    id,
    standardName,
  }) => post('/skill/edit/skill-name-map', {
    appId,
    id,
    standardName,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    appId,
    id,
    standardName,
  }) => put('/skill/edit/skill-name-map', {
    appId,
    id,
    standardName,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill-name-map/${id}`),
);

export const readConfig = createAction(
  READ_CONFIG,
  () => read('/skill/edit/skill-name-map/config'),
);
