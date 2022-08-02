import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, del, put, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testSuite');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const REMOVE = actionType('REMOVE');
export const UPDATE = actionType('UPDATE');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    pageSize,
    startTime,
    endTime,
    title,
  }) => read('/skill/edit/test/suite/page', {
    page,
    pageSize,
    startTime,
    endTime,
    title,
  }),
);

export const create = createAction(
  CREATE,
  ({
    description,
    suiteType,
    testCaseIds,
    title,
  }) => post('/skill/edit/test/suite', {
    description,
    suiteType,
    testCaseIds,
    title,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    description,
    suiteType,
    testCaseIds,
    title,
  }) => put(`/skill/edit/test/suite/${id}`, {
    description,
    suiteType,
    testCaseIds,
    title,
  }),
);

export const remove = createAction(
  REMOVE,
  ({
    id,
  }) => del(`/skill/edit/test/suite/${id}`),
);
