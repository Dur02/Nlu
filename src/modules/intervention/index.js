import React from 'react';
import { INTERVENTION } from 'shared/constants/features';
import { readAll as readAllIntervention } from 'shared/actions/intervention';
import { readMine as readProfile } from 'shared/actions/user';

import Intervention from './intervention';

export default () => [{
  feature: INTERVENTION,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllIntervention()),
        dispatch(readProfile()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <Intervention />,
    };
  },
}];
