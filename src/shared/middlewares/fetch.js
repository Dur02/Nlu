import { getEntity } from 'relient/selectors';
import { throwServerError } from 'relient/actions/server-error';
import { prop } from 'lodash/fp';

const deserialize = (response) => {
  const header = response.headers.get('Content-Type') || '';
  if (header.indexOf('application/json') > -1) {
    return response.json();
  }
  if (header.indexOf('application/octet-stream') > -1) {
    return response.arrayBuffer();
  }
  return response.text();
};

const { ignoreAuthRedirection, ignoreGlobalWarning } = global;

export default ({
  fetch,
  apiDomain: globalApiDomain,
  onUnauthorized,
  onGlobalWarning,
}) => ({
  getState,
  dispatch,
}) => (next) => async (action) => {
  const { payload, meta } = action;
  if (payload) {
    const {
      url, isApi, withoutAuth, apiDomain, headers, ...others
    } = payload;
    if (isApi) {
      const state = getState();
      const response = await fetch(`${apiDomain || globalApiDomain}${url}`, {
        ...others,
        credentials: 'same-origin',
        headers: {
          ...(withoutAuth ? {} : {
            token: getEntity('auth.authorization')(state),
          }),
          ...headers,
        },
      });
      const data = await deserialize(response);
      if (response.status >= 200 && response.status < 300 && (!data.code || data.code === 'SUCCESS')) {
        next({ ...action, payload: data });
        return data;
      }

      if (!prop('ignoreGlobalWarning')(meta) && !ignoreGlobalWarning && onGlobalWarning) {
        onGlobalWarning({ payload: data, getState, dispatch });
      }

      if ((response.status === 401 || (data && data.code === 'NOT_LOGIN')) && !prop('ignoreAuthRedirection')(meta) && !ignoreAuthRedirection && onUnauthorized) {
        onUnauthorized({ payload: data, getState, dispatch });
      }

      dispatch(throwServerError(data, {
        status: response.status,
        statusText: response.statusText,
        ignoreGlobalWarning: prop('ignoreGlobalWarning')(meta),
        ignoreAuthRedirection: prop('ignoreAuthRedirection')(meta),
        originalAction: action,
      }));
      throw data;
    }
  }
  return next(action);
};
