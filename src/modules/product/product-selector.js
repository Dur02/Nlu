import { getEntity, getEntityArray } from 'relient/selectors';
import {
  map,
  flow,
  filter,
  propEq,
  orderBy,
  prop,
  values,
  last,
} from 'lodash/fp';
import { getSkillsWithCodeKey } from 'shared/selectors';

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
    getSkillsWithCodeKey,
    values,
    map((skill) => {
      const skillVersions = flow(
        getEntityArray('skillVersion'),
        filter(propEq('code', skill.code)),
        orderBy(['id'], ['desc']),
      )(state);
      return {
        ...skill,
        originalId: flow(last, prop('id'))(skillVersions),
        skillVersions,
      };
    }),
    orderBy(['originalId'], ['desc']),
  )(state),
});
