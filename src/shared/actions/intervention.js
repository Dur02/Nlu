import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/intervention');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    pageSize = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/intervention/list', {
    page,
    pageSize,
  }),
);

export const create = createAction(
  CREATE,
  ({
    intentId,
    productId,
    response,
    sentence,
    skillId,
    type,
    wildLeft,
    wildRight,
  }) => post('/skill/edit/intervention', {
    intentId,
    productId,
    response,
    sentence,
    skillId,
    type,
    wildLeft,
    wildRight,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    intent,
    productId,
    response,
    sentence,
    skillCode,
    type,
    wildLeft,
    wildRight,
  }) => put('/skill/edit/intervention', {
    id,
    intent,
    productId,
    response,
    sentence,
    skillCode,
    type,
    wildLeft,
    wildRight,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/intervention/${id}`),
);
