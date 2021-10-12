import { random, datatype, date } from 'faker';
import { find, map, propEq, range } from 'lodash/fp';
import { pagination } from 'shared/mocker-utiles';

export const createItem = (values) => ({
  id: datatype.number(),
  name: random.word(),
  description: random.words(),
  createPerson: 'wm',
  createTime: date.past(),
  ...values,
});

export const items = map(createItem)(range(1, 4));

export default (router) => {
  router.get('/nlu/edit/product/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/product/:id', ({ params: { id } }, response) => {
    response.status(200).send({ data: find(propEq('id', Number(id)))(items) });
  });

  router.post('/nlu/edit/product', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send({ data: item });
  });

  router.put('/nlu/edit/product/:id', ({ body, params: { id } }, response) => {
    response.status(200).send({ data: { ...body, id: Number(id) } });
  });

  router.delete('/nlu/edit/product/:id', (request, response) => {
    response.status(204).send();
  });
};
