import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/intent-map');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const READ_INFO = actionType('READ_INFO');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    pageSize,
    intentMapName,
  } = {}) => read('/skill/edit/intent-map', {
    page,
    pageSize,
    intentMapName,
  }),
);

export const create = createAction(
  CREATE,
  ({
    skillCode,
    intentName,
    intentMapName,
  }) => post('/skill/edit/intent-map', {
    skillCode,
    intentName,
    intentMapName,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    skillCode,
    intentName,
  }) => put('/skill/edit/intent-map', {
    id,
    skillCode,
    intentName,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/intent-map/${id}`),
);

export const readInfo = createAction(
  READ_INFO,
  () => read('/skill/edit/intent-map/info'),
);
