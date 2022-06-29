import React from 'react';
import { PRODUCT } from 'shared/constants/features';
import { readAll as readAllProduct } from 'shared/actions/product';
import { readAll as readAllProductVersion } from 'shared/actions/product-version';
import { readAll as readAllSkillVersion } from 'shared/actions/skill-version';

import Product from './product';

export default () => [{
  feature: PRODUCT,
  action: async ({ store: { dispatch } }) => {
    try {
      await Promise.all([
        dispatch(readAllProductVersion()),
        dispatch(readAllProduct()),
        dispatch(readAllSkillVersion()),
      ]);
    } catch (e) {
      // ignore
    }
    return {
      component: <Product />,
    };
  },
}];
