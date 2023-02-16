import {
  createAction,
  actionTypeCreator,
} from 'relient/actions';
import { read } from 'relient/actions/request';

const actionType = actionTypeCreator('actions/testJobResult');

export const READ_ALL = actionType('READ_ALL');
export const READ_NUM = actionType('READ_NUM');
export const RESULT_EXPORT = actionType('RESULT_EXPORT');
export const GET_ERROR_CODE = actionType('GET_ERROR_CODE');
export const GET_ERROR_DETAIL = actionType('GET_ERROR_DETAIL');

export const readAll = createAction(
  READ_ALL,
  ({
    jobId,
    page,
    pageSize,
    passed,
    errorCode,
  }) => read('/skill/edit/test/job/result/page', {
    jobId,
    pageSize,
    page,
    passed,
    errorCode,
  }),
);

export const readNum = createAction(
  READ_NUM,
  ({
    jobId,
  }) => read(`/skill/edit/test/job/result/${jobId}`),
);

export const resultExport = createAction(
  RESULT_EXPORT,
  ({
    jobId,
    passed,
  }) => read('/skill/edit/test/job/result/export', {
    jobId,
    passed,
  }),
);

export const getErrorCode = createAction(
  GET_ERROR_CODE,
  () => read('/skill/edit/test/job/result/error'),
);

export const getErrorDetail = createAction(
  GET_ERROR_DETAIL,
  ({ jobId }) => read(`/skill/edit/test/job/result/error/${jobId}`),
);
