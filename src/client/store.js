import { createStore, applyMiddleware, compose } from 'redux';
import {
  history as historyMiddleware,
} from 'relient/middlewares';
import { push } from 'relient/actions/history';
import reducers from 'shared/reducers';
import fetch from 'isomorphic-fetch/fetch-npm-browserify';
import fetchMiddleware from 'shared/middlewares/fetch';
import { message } from 'antd';
import { prop } from 'lodash/fp';
import pushMiddleware from 'relient/middlewares/push';
import getConfig from 'relient/config';
import { getWithBaseUrl } from 'relient/url';
import authorization from './middlewares/cookie';
import history from './history';

const { __REDUX_DEVTOOLS_EXTENSION__, __INITIAL_STATE__ = {} } = global;

const middlewares = [
  fetchMiddleware({
    fetch,
    apiDomain: `${global.location.origin}`,
    onUnauthorized: ({ dispatch, payload }) => {
      message.error({
        key: payload.msg || '权限错误，请重新登陆适当账号',
        content: payload.msg || '权限错误，请重新登陆适当账号',
        duration: 5,
      });
      dispatch(push(getWithBaseUrl('/auth/login', getConfig('baseUrl'))));
    },
    onGlobalWarning: async ({ payload }) => {
      const content = prop('msg')(payload);
      message.error({
        content,
        key: content,
        duration: 5,
      });
    },
  }),
  authorization,
  pushMiddleware(getConfig('baseUrl')),
  historyMiddleware(history),
];
let enhancer = applyMiddleware(...middlewares);

if (__DEV__) {
  // eslint-disable-next-line global-require
  middlewares.push(require('redux-logger').createLogger({ collapsed: true }));
  if (__REDUX_DEVTOOLS_EXTENSION__) {
    enhancer = compose(
      applyMiddleware(...middlewares),
      __REDUX_DEVTOOLS_EXTENSION__(),
    );
  }
}

export default createStore(
  reducers,
  __INITIAL_STATE__,
  enhancer,
);
