import { flow, prop, map } from 'lodash/fp';
import { getCurrentAccount } from 'shared/selectors/account';
import { features } from 'shared/constants/features';
import { getSelectedFeatures } from 'relient/features';

export default (state) => {
  const currentAccount = getCurrentAccount(state);
  return {
    currentAccount,
    selectedFeatureKeys: flow(prop('feature'), getSelectedFeatures, map(prop('key')))(state),
    features,
  };
};
