import React from 'react';
import { INFORMATION } from 'shared/constants/features';
import { readMine as readProfile } from 'shared/actions/user';
import { readAll } from 'shared/actions/information';
import NluInfo from './information';

export default () => [{
  feature: INFORMATION,
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
      component: <NluInfo />,
    };
  },
}];
