import React from 'react';
import { NLU_INFO } from 'shared/constants/features';
import { readMine as readProfile } from 'shared/actions/user';
import { readAll } from 'shared/actions/nlu-info';
import Info from './info';

export default () => [{
  feature: NLU_INFO,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readProfile()),
      ]);
      await dispatch(readAll());
    } catch (e) {
      // ignore
    }
    return {
      component: <Info />,
    };
  },
}];
