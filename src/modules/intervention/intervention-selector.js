import { getEntity, getEntityArray } from 'relient/selectors';
import { flow, filter, map, any } from 'lodash/fp';

const mapWithIndex = map.convert({ cap: false });

export default (state) => {
  const productVersions = getEntityArray('productVersion')(state);

  return {
    productEntity: getEntity('product')(state),
    skillVersionEntity: getEntity('skillVersion')(state),
    intervention: flow(
      getEntityArray('intervention'),
      map((item) => {
        // 在slots加入一个index构造的key，用作展开时的rowKey
        if (item.slots !== null) {
          const a = mapWithIndex((item2, index) => ({ ...item2, key: index }))(item.slots);
          return ({ ...item, slots: a });
        }
        return item;
      }),
    )(state),
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
