import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';
import { pick, map } from 'lodash/fp';

const actionType = actionTypeCreator('actions/output');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

const parseParams = (params) => params && JSON.stringify({
  extra: map(pick(['name', 'value', 'example']))(params.extra),
  slots: map(pick(['name', 'value', 'example']))(params.slots),
});

export const readAll = createAction(
  READ_ALL,
  ({
    current = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/output/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/output/${id}`),
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
    responses,
    skillId,
  }) => post('/skill/edit/output', {
    intentId,
    component,
    name,
    resource,
    location,
    params: parseParams(params),
    responses: responses && JSON.stringify(responses),
    skillId,
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
    responses,
    skillId,
  }) => put(`/skill/edit/output/${id}`, {
    intentId,
    component,
    name,
    resource,
    location,
    params: parseParams(params),
    responses: responses && JSON.stringify(responses),
    skillId,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/output/${id}`),
);
