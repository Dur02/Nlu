import React from 'react';
import { CASE, SUITE, JOB } from 'shared/constants/features';
import { readAll as readTestCase } from 'shared/actions/test-case';
import { readAll as readTestSuite } from 'shared/actions/test-suite';
import { readAll as readAllSkills } from 'shared/actions/skill';
import { readAll as readAllIntents } from 'shared/actions/intent';
import { readMine as readProfile } from 'shared/actions/user';
import { map, prop } from 'lodash/fp';
import Case from './case';
import Suite from './suite';
import Job from './job';

export default () => [{
  path: '/case',
  feature: CASE,
  action: async ({ store: { dispatch } }) => {
    await Promise.all([
      dispatch(readAllSkills()),
      dispatch(readAllIntents()),
      dispatch(readProfile()),
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
      const {
        data: {
          data,
          currentPage,
          pageSize,
          total,
        },
      } = await dispatch(readTestSuite({
        page: 10,
        pageSize: 1,
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
      // eslint-disable-next-line no-console
      console.log('111', dispatch);
    } catch (e) {
      // ignore
    }
    return {
      component: <Job />,
    };
  },
}];
