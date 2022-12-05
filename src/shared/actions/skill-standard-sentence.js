import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, post, put, del } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-standard-sentence');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');
export const CHANGE_ORDER = actionType('CHANGE_ORDER');

export const readAll = createAction(
  READ_ALL,
  ({
    id,
  }) => read(`/skill/edit/skill-standard/sentences/${id}`),
);

export const create = createAction(
  CREATE,
  ({
    appSkillId,
    homePageShow,
    sentenceName,
  }) => post('/skill/edit/skill-standard/sentence', {
    appSkillId,
    homePageShow,
    sentenceName,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    homePageShow,
    sentenceName,
  }) => put('/skill/edit/skill-standard/sentence', {
    id,
    homePageShow,
    sentenceName,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill-standard/sentence/${id}`),
);

export const changeOrder = createAction(
  CHANGE_ORDER,
  ({
    id,
    order,
  }) => put('/skill/edit/skill-standard/sentence/rank', {
    id,
    order,
  }),
);
