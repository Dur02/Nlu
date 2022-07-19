import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, filter, map, any } from 'lodash/fp';

export default (state) => {
  const productVersions = getEntityArray('productVersion')(state);

  return {
    productEntity: getEntity('product')(state),
    skillVersionEntity: getEntity('skillVersion')(state),
    intervention: getEntityArray('intervention')(state),
    intents: getEntityArray('intent')(state),
    productOptions: flow(
      getEntityArray('product'),
      filter(({ id }) => any(
        ({ productId, pubState }) => productId === id && pubState === 1,
      )(productVersions)),
      map(({ name, id }) => ({
        label: name,
        value: id,
      })),
    )(state),
  };
};
