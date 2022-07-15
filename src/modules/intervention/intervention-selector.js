import { getEntityArray } from 'relient/selectors';
import { getSkillsWithVersions, getAllProduct } from 'shared/selectors';

export default (state) => ({
  intervention: getEntityArray('intervention')(state),
  skills: getSkillsWithVersions(state),
  products: getAllProduct(state),
  intents: getEntityArray('intent')(state),
});
