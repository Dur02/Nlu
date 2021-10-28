import { random, datatype, date } from 'faker';
import { map, range, flow, sample, prop } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { items as products } from './product';

export const createItem = (values) => ({
  id: datatype.number(),
  productId: flow(sample, prop('id'))(products),
  versionName: random.word(),
  versionNum: random.word(),
  description: random.words(),
  createPerson: 'wm',
  createTime: date.past(),
  pubState: sample([0, 1]),
  ...values,
});

export const items = map(createItem)(range(1, 4));

export default (router) => {
  router.get('/skill/edit/product-version/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.post('/skill/edit/product-version', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });
};
