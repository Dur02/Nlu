import { getEntity, getEntityArray } from 'relient/selectors';
import {
  map,
  flow,
  filter,
  propEq,
  orderBy,
  prop,
} from 'lodash/fp';
import { getSkillsWithVersions } from 'shared/selectors';

export default (state) => ({
  products: flow(
    getEntityArray('product'),
    orderBy(['id'], ['desc']),
    map((product) => ({
      ...product,
      skillCodes: map((skillId) => flow(
        getEntity(`skillVersion.${skillId}`),
        prop('code'),
      )(state))(product.skillIds),
      productVersions: flow(
        getEntityArray('productVersion'),
        filter(propEq('productId', product.id)),
        orderBy(['id'], ['desc']),
      )(state),
    })),
  )(state),
  skills: flow(
    getSkillsWithVersions,
  )(state),
});
