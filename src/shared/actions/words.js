import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';
import { map } from 'lodash/fp';

const actionType = actionTypeCreator('actions/words');

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
  } = {}) => read('/nlu/edit/words/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/nlu/edit/words/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    skillId,
    name,
    content,
  }) => post('/nlu/edit/words', {
    skillId,
    name,
    content: JSON.stringify(map(({ word, synonym }) => ([word, synonym]))(content)),
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    content,
  }) => put(`/nlu/edit/words/${id}`, {
    name,
    content: JSON.stringify(map(({ word, synonym }) => ([word, synonym]))(content)),
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/nlu/edit/words/${id}`),
);
