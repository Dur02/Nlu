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
    skillId,
    type,
  } = {}) => read('/skill/edit/words/all', {
    current,
    size,
    skillId,
    type,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/words/${id}`),
);

const convertContent = ({ word, synonym }) => {
  if (synonym) {
    return [word, synonym];
  }
  return [word];
};

export const create = createAction(
  CREATE,
  ({
    skillId,
    name,
    content,
  }) => post('/skill/edit/words', {
    skillId,
    name,
    content: content && JSON.stringify(map(convertContent)(content)),
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    content,
  }) => put(`/skill/edit/words/${id}`, {
    name,
    content: content && JSON.stringify(map(convertContent)(content)),
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/words/${id}`),
);
