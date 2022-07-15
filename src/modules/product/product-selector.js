import { getSkillsWithVersions, getAllProduct } from 'shared/selectors';

export default (state) => ({
  products: getAllProduct(state),
  skills: getSkillsWithVersions(state),
});
