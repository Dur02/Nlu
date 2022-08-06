import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read, put, post } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testJob');

export const READ_ALL = actionType('READ_ALL');
export const CREATE = actionType('CREATE');
export const CANCEL = actionType('CANCEL');
export const UPDATE = actionType('UPDATE');
export const GET_PROCESS = actionType('GET_PROCESS');

export const readAll = createAction(
  READ_ALL,
  ({
    page,
    pageSize,
    startTime,
    endTime,
    status,
    title,
  }) => read('/skill/edit/test/job/page', {
    page,
    pageSize,
    startTime,
    endTime,
    status,
    title,
  }),
);

export const create = createAction(
  CREATE,
  ({
    jobConfig,
    testSuiteId,
    title,
  }) => post('/skill/edit/test/job', {
    jobConfig,
    testSuiteId,
    title,
  }),
);

export const update = createAction(
  UPDATE,
  ({
    id,
    jobConfig,
    testSuiteId,
    title,
  }) => put(`/skill/edit/test/job/${id}`, {
    jobConfig,
    testSuiteId,
    title,
  }),
);

export const cancel = createAction(
  CANCEL,
  ({
    id,
  }) => put(`/skill/edit/test/job/${id}/cancel`),
);

export const getProcess = createAction(
  GET_PROCESS,
  ({
    id,
  }) => read(`/skill/edit/test/jobs/${id}/process`),
);
