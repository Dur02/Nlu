import { random, datatype } from 'faker';
import { map, range, flow, sample, prop, find, propEq } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { items as intents } from './intent';

export const createItem = (values) => ({
  id: datatype.number(),
  sentence: random.words(),
  slots: '[]',
  intentId: flow(sample, prop('id'))(intents),
  ...values,
});

export const items = map(createItem)(range(1, 1));

export default (router) => {
  router.get('/nlu/edit/rule/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/rule/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/nlu/edit/rule', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/nlu/edit/rule/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/nlu/edit/rule/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
