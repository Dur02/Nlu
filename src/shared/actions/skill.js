import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { DEFAULT_CURRENT, DEFAULT_SIZE } from 'shared/constants/pagination';
import { read, post, del, put } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill');

export const READ_ALL = actionType('READ_ALL');
export const READ_ONE = actionType('READ_ONE');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const READ_WORD_GRAPH = actionType('READ_WORD_GRAPH');
export const UPLOAD = actionType('UPLOAD');

export const readAll = createAction(
  READ_ALL,
  ({
    current = DEFAULT_CURRENT,
    size = DEFAULT_SIZE,
  } = {}) => read('/skill/edit/skill/all', {
    current,
    size,
  }),
);

export const readOne = createAction(
  READ_ONE,
  ({ id }) => read(`/skill/edit/skill/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    name,
    category,
    iconPath,
    productId,
  }) => post('/skill/edit/skill', {
    name,
    category,
    iconPath,
    productId,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    name,
    category,
    iconPath,
  }) => put(`/skill/edit/skill/${id}`, {
    name,
    category,
    iconPath,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill/${id}`),
);

export const readWordGraph = createAction(
  READ_WORD_GRAPH,
  ({ input, skillCode }) => read('/nlu/rest/v1/index/search', { refText: input, skillCode }),
);

export const upload = createAction(
  UPLOAD,
  ({ file }) => post('/skill/edit/skill/excel-import', { file }),
);
