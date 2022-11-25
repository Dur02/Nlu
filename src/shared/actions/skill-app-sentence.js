import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { post, put, del } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/skill-app-sentence');

export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

export const create = createAction(
  CREATE,
  ({
    appSkillId,
    order,
    sentenceName,
  }) => post('/skill/edit/skill-app/sentence', {
    appSkillId,
    order,
    sentenceName,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    order,
    sentenceName,
  }) => put('/skill/edit/skill-app/sentence', {
    id,
    order,
    sentenceName,
  }),
);

export const remove = createAction(
  REMOVE,
  ({ id }) => del(`/skill/edit/skill-app/sentence/${id}`),
);
