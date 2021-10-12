import { random, datatype } from 'faker';
import { map, range } from 'lodash/fp';
import { pagination } from 'shared/mocker-utiles';

export const createItem = (values) => ({
  id: datatype.number(),
  name: `sys.${random.word()}`,
  type: 'selection',
  ...values,
});

export const items = map(createItem)(range(1, 4));

export default (router) => {
  router.get('/nlu/edit/builtin-intent/all', ({ query }, response) => {
    response.status(200).send(pagination(query)(items));
  });
};
