import { random, datatype, date } from 'faker';
import { find, map, propEq, range } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';

export const createItem = (values) => ({
  id: datatype.number(),
  name: random.word(),
  description: random.words(),
  createPerson: 'wm',
  createTime: date.past(),
  skillIds: [],
  ...values,
});

export const items = map(createItem)(range(1, 4));

export default (router) => {
  router.get('/skill/edit/product/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/skill/edit/product/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/skill/edit/product/:id/skill', (request, response) => {
    response.status(200).send(single()());
  });

  router.delete('/skill/edit/product/:id/skill', (request, response) => {
    response.status(200).send(single()());
  });

  router.post('/skill/edit/product', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/skill/edit/product/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/skill/edit/product/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
