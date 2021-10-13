import { getEntityArray } from 'relient/selectors';
import { map, flow, filter, propEq } from 'lodash/fp';

export default (state) => ({
  products: flow(
    getEntityArray('product'),
    map((product) => ({
      ...product,
      productVersions: flow(
        getEntityArray('productVersion'),
        filter(propEq('productId', product.id)),
      )(state),
    })),
  )(state),
  skills: getEntityArray('skill')(state),
});
