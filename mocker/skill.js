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
  isPublished: datatype.boolean(),
  ...values,
});

export const items = map(createItem)(range(1, 2));

export default (router) => {
  router.get('/skill/edit/skill/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/skill/edit/skill/:id', ({ params: { id } }, response) => {
    response.status(200).send(single()(find(propEq('id', Number(id)))(items)));
  });

  router.post('/skill/edit/skill', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });

  router.put('/skill/edit/skill/:id', ({ body, params: { id } }, response) => {
    response.status(200).send(single()({ ...body, id: Number(id) }));
  });

  router.delete('/skill/edit/skill/:id', (request, response) => {
    response.status(200).send(single()());
  });
};
