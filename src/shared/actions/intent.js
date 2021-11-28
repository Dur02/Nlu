import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';
import { map, join, pick } from 'lodash/fp';

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
  } = {}) => read('/skill/edit/intent/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/intent/${id}`),
);

const slotProps = ['lexiconsNames', 'required', 'isSlot', 'name', 'prompt'];

export const create = createAction(
  CREATE,
  ({
    name,
    type,
    skillId,
    slots,
  }) => post('/skill/edit/intent', {
    name,
    type,
    skillId,
    slots: slots && JSON.stringify(map((slot) => ({
      ...pick(slotProps)(slot),
      lexiconsNames: join(',')(slot.lexiconsNames),
    }))(slots)),
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    slots,
  }) => put(`/skill/edit/intent/${id}`, {
    name,
    slots: slots && JSON.stringify(map((slot) => ({
      ...pick(slotProps)(slot),
      lexiconsNames: join(',')(slot.lexiconsNames),
    }))(slots)),
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/intent/${id}`),
);
