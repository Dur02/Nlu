import { random, datatype } from 'faker';
import { map, range, find, propEq, join } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';

export const createItem = (values) => {
  const content1 = random.word();
  const content2 = random.word();
  return {
    id: datatype.number(),
    name: `sys.${random.word()}`,
    content: JSON.stringify([[
      content1,
      join(',')([
        content1,
        random.word(),
        random.word(),
        random.word(),
        random.word(),
      ]),
    ], [
      content2,
      join(',')([
        content2,
        random.word(),
        random.word(),
        random.word(),
        random.word(),
      ]),
    ]]),
    skillId: 0,
    ...values,
  };
};

export const items = map(createItem)(range(1, 12));

export default (router) => {
  router.get('/nlu/edit/words/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/words/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/nlu/edit/words', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/nlu/edit/words/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/nlu/edit/words/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
