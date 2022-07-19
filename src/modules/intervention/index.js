import React from 'react';
import { INTERVENTION } from 'shared/constants/features';
import { readAll as readAllIntervention } from 'shared/actions/intervention';
import { readMine as readProfile } from 'shared/actions/user';
import { readAll as readAllSkills } from 'shared/actions/skill';
import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readAllProductVersion } from 'shared/actions/product-version';

import Intervention from './intervention';

export default () => [{
  feature: INTERVENTION,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllIntervention()),
        dispatch(readAllSkills()),
        dispatch(readAllProduct()),
        dispatch(readProfile()),
        dispatch(readAllProductVersion()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <Intervention />,
    };
  },
}];
