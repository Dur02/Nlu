import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/rule');

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
  } = {}) => read('/nlu/edit/rule/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/nlu/edit/rule/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    intentId,
    sentence,
    slots,
  }) => post('/nlu/edit/rule', {
    intentId,
    sentence,
    slots: JSON.stringify(slots),
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    sentence,
    slots,
  }) => put(`/nlu/edit/rule/${id}`, {
    sentence,
    slots: JSON.stringify(slots),
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/nlu/editor/rule/${id}`),
);
