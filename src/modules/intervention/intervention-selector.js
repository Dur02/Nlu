import { getIntervention } from 'shared/selectors';

export default (state) => ({
  intervention: getIntervention(state),
});
