import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testJob');

export const READ_ALL = actionType('READ_ALL');

export const readAll = createAction(
  READ_ALL,
  ({
    id,
    pageSize,
    page,
  }) => read(`/skill/edit/test/jobs/${id}/page`, {
    pageSize,
    page,
  }),
);
