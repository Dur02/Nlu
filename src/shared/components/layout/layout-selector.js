import { flow, prop, map } from 'lodash/fp';
import { getCurrentUser } from 'shared/selectors';
import { features } from 'shared/constants/features';
import { getSelectedFeatures } from 'relient/features';

export default (state) => {
  const currentUser = getCurrentUser(state);
  return {
    currentUser,
    selectedFeatureKeys: flow(prop('feature'), getSelectedFeatures, map(prop('key')))(state),
    features,
  };
};
