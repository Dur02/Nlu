import React from 'react';
import { CASE, SUITE, JOB } from 'shared/constants/features';

import Case from './case';
import Suite from './suite';
import Job from './job';

export default () => [{
  path: '/case',
  feature: CASE,
  action: async ({ store: { dispatch } }) => {
    try {
      // eslint-disable-next-line no-console
      console.log('111', dispatch);
    } catch (e) {
      // ignore
    }
    return {
      component: <Case />,
    };
  },
}, {
  path: '/suite',
  feature: SUITE,
  action: async ({ store: { dispatch } }) => {
    try {
      // eslint-disable-next-line no-console
      console.log('111', dispatch);
    } catch (e) {
      // ignore
    }
    return {
      component: <Suite />,
    };
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
