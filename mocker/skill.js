import { random, datatype } from 'faker';
import { map, range, sample, flow, prop, find, propEq } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { skillCategories } from 'shared/constants/skill-category';
import { iconPaths } from 'shared/constants/icon-path';
import { items as products } from './product';

export const createItem = (values) => ({
  id: datatype.number(),
  name: random.word(),
  category: sample(skillCategories),
  iconPath: sample(iconPaths),
  productId: flow(sample, prop('id'))(products),
  isPublished: sample([true, false]),
  ...values,
});

export const items = map(createItem)(range(1, 40));

export default (router) => {
  router.get('/nlu/edit/skill/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/skill/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/nlu/edit/skill', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/nlu/edit/skill/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/nlu/edit/skill/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
