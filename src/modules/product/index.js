import React from 'react';
import { PRODUCT } from 'shared/constants/features';
import Product from './product';

export default () => [{
  feature: PRODUCT,
  component: <Product />,
}];
