import { random, datatype } from 'faker';
import { map, range, sample, flow, prop, find, propEq } from 'lodash/fp';
import { pagination } from 'shared/mocker-utiles';
import { skillCategories } from 'shared/constants/skill-category';
import { iconPaths } from 'shared/constants/icon-path';
import { items as products } from './product';

export const createItem = (values) => ({
  id: datatype.number(),
  name: random.word(),
  category: sample(skillCategories),
  iconPath: sample(iconPaths),
  productId: flow(sample, prop('id'))(products),
  ...values,
});

export const items = map(createItem)(range(1, 12));

export default (router) => {
  router.get('/nlu/edit/skill/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.get('/nlu/edit/skill/:id', ({ params: { id } }, response) => {
    response.status(200).send({ data: find(propEq('id', Number(id)))(items) });
  });

  router.post('/nlu/edit/skill', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send({ data: item });
  });

  router.put('/nlu/edit/skill/:id', ({ body, params: { id } }, response) => {
    response.status(200).send({ ...body, id: Number(id) });
  });

  router.delete('/nlu/edit/skill/:id', (request, response) => {
    response.status(204).send();
  });
};
