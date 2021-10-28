import { lorem, datatype } from 'faker';
import { map, range, sample, find, propEq } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { items as intents } from './intent';

export const createItem = (values) => {
  const intent = sample(intents);
  const sentence = lorem.sentence();
  return {
    id: datatype.number(),
    sentence,
    taskClassify: datatype.boolean(),
    slots: JSON.stringify([{
      pos: [0, 2],
      value: sentence.slice(0, 2),
      name: JSON.parse(intent.slots)[0].name,
    }, {
      pos: [8, 14],
      value: sentence.slice(8, 14),
      name: JSON.parse(intent.slots)[1].name,
    }]),
    intentId: intent.id,
    ...values,
  };
};

export const items = map(createItem)(range(1, 40));

export default (router) => {
  router.get('/skill/edit/rule/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/skill/edit/rule/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/skill/edit/rule', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/skill/edit/rule/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/skill/edit/rule/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
