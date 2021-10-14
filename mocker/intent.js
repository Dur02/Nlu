import { random, datatype } from 'faker';
import { map, range, flow, sample, prop, find, propEq } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { SEMANTIC } from 'shared/constants/intent-type';
import { items as skills } from './skill';

export const createItem = (values) => ({
  id: datatype.number(),
  name: random.word(),
  type: SEMANTIC,
  slots: '[]',
  skillId: flow(sample, prop('id'))(skills),
  ...values,
});

export const items = map(createItem)(range(1, 200));

export default (router) => {
  router.get('/nlu/edit/intent/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/intent/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/nlu/edit/intent', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/nlu/edit/intent/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/nlu/edit/intent/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
