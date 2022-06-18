import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/product');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const ATTACH_SKILLS = actionType('ATTACH_SKILLS');
export const DETACH_SKILLS = actionType('DETACH_SKILLS');
export const READ_PRODUCT_WORD_GRAPH = actionType('READ_PRODUCT_WORD_GRAPH');

export const readAll = createAction(
  READ_ALL,
  ({
    page = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/product/all', {
    current: page,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/product/${id}`),
);

export const create = createAction(
  CREATE,
  ({ name, description }) => post('/skill/edit/product', { name, description }),
);

export const update = createAction(
  UPDATE,
  ({ id, name, description }) => put(`/skill/edit/product/${id}`, { name, description }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/product/${id}`),
);

export const attachSkills = createAction(
  ATTACH_SKILLS,
  ({ id, skillIds }) => post(`/skill/edit/product/${id}/skill`, { skillIds }),
);

export const detachSkills = createAction(
  DETACH_SKILLS,
  ({ id, skillIds }) => del(`/skill/edit/product/${id}/skill`, { skillIds }),
);

export const readWordGraph = createAction(
  READ_PRODUCT_WORD_GRAPH,
  ({ input, productId }) => read('/skill/edit/word-map/product/search', { refText: input, productId }),
);
