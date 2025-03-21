import React from 'react';
import { CASE, SUITE, JOB } from 'shared/constants/features';
import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { readAll as readTestSuite } from 'shared/actions/test-suite';
import { readAll as readTestJob } from 'shared/actions/test-job';
import { readAll as readJobResult, readNum, getErrorCode, getErrorDetail } from 'shared/actions/test-job-result';
import { readMine as readProfile } from 'shared/actions/user';
import { map, prop } from 'lodash/fp';
import Case from './case';
import Suite from './suite';
import Job from './job';
import Result from './result';

export default () => [{
  path: '/case',
  feature: CASE,
  action: async ({ store: { dispatch } }) => {
    await Promise.all([
      dispatch(readProfile()),
      // dispatch(readAllSkills()),
      // dispatch(readAllIntents()),
    ]);
    try {
      const {
        data: {
          data,
          currentPage,
          pageSize,
          total,
        },
      } = await dispatch(readTestCase({
        page: 1,
        pageSize: 10,
      }));
      return {
        component: <Case
          ids={map(prop('id'))(data)}
          total={total}
          current={currentPage - 1}
          size={pageSize}
        />,
      };
    } catch (e) {
      return {
        component: <Case
          ids={[]}
          total={0}
          current={0}
          size={0}
        />,
      };
    }
  },
}, {
  path: '/suite',
  feature: SUITE,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
        dispatch(readAllProduct()),
      ]);
      const {
        data: {
          data,
          currentPage,
          pageSize,
          total,
        },
      } = await dispatch(readTestSuite({
        page: 1,
        pageSize: 10,
      }));
      return {
        component: <Suite
          ids={map(prop('id'))(data)}
          total={total}
          current={currentPage - 1}
          size={pageSize}
        />,
      };
    } catch (e) {
      return {
        component: <Suite
          ids={[]}
          total={0}
          current={0}
          size={0}
        />,
      };
    }
  },
}, {
  path: '/job',
  feature: JOB,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
        dispatch(readAllProduct()),
      ]);
      const {
        data: {
          data: caseData,
        },
      } = await dispatch(readTestSuite({
        page: 1,
        pageSize: 999999,
      }));
      const {
        data: {
          data,
          currentPage,
          pageSize,
          total,
        },
      } = await dispatch(readTestJob({
        page: 1,
        pageSize: 10,
      }));
      return {
        component: <Job
          ids={map(prop('id'))(data)}
          total={total}
          current={currentPage - 1}
          size={pageSize}
          caseData={map(({ id, title }) => ({
            label: title,
            value: id,
          }))(caseData)}
        />,
      };
    } catch (e) {
      return {
        component: <Job
          ids={[]}
          total={0}
          current={0}
          size={0}
        />,
      };
    }
  },
}, {
  path: '/job/:id/:title',
  feature: JOB,
  action: async ({ params: { id, title }, store: { dispatch } }) => {
    const jobId = Number(id);
    try {
      const {
        data: {
          data: resultData,
        },
      } = await dispatch(readJobResult({ jobId, page: 1, pageSize: 100 }));
      const { data: numData } = await dispatch(readNum({ jobId }));
      const { data: errorDetail } = await dispatch(getErrorDetail({ jobId }));
      const { data: errorCodeType } = await dispatch(getErrorCode());
      return {
        component: <Result
          jobId={jobId}
          title={title}
          numData={numData}
          initResultId={map(prop('id'))(resultData)}
          errorDetail={errorDetail}
          errorCodeType={errorCodeType}
        />,
      };
    } catch (e) {
      return {
        redirect: '/test/job',
      };
    }
  },
}];
