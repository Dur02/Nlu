import { datatype, random } from 'faker';
import { sample, flow, prop, find, propEq, map, omit } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { outputComponents } from 'shared/constants/output-component';
import { outputResources } from 'shared/constants/output-resource';
import { items as intents } from './intent';

export const createItem = (values) => ({
  id: datatype.number(),
  intentId: flow(sample, prop('id'))(intents),
  component: sample(outputComponents),
  resource: sample(outputResources),
  params: values.slots && JSON.stringify({
    extra: [{
      name: random.word(),
      value: random.word(),
      example: random.word(),
    }],
    slots: map(({ name }) => ({
      name: random.word(),
      value: name,
      example: random.word(),
    }))(JSON.parse(values.slots)),
  }),
  responses: JSON.stringify([{
    commandFirst: false,
    readOnly: true,
  }]),
  ...omit(['slots'])(values),
});

export const items = map(({ id, slots }) => createItem({ intentId: id, slots }))(intents);

export default (router) => {
  router.get('/nlu/edit/output/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/output/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/nlu/edit/output', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/nlu/edit/output/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/nlu/edit/output/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
