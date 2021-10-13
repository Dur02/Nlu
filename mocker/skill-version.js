import { random, datatype, date } from 'faker';
import { map, range, flow, sample, prop } from 'lodash/fp';
import { pagination, single } from 'shared/mocker-utiles';
import { items as skills } from './skill';

export const createItem = (values) => ({
  id: datatype.number(),
  skillId: flow(sample, prop('id'))(skills),
  note: random.words(),
  userName: 'wm',
  createDate: date.past(),
  pubState: sample([0, 1]),
  ...values,
});

export const items = map(createItem)(range(1, 4));

export default (router) => {
  router.get('/nlu/edit/skill-version/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });

  router.post('/nlu/edit/skill-version', ({ body }, response) => {
    const item = createItem(body);
    items.push(item);
    response.status(200).send(single()(item));
  });
};
