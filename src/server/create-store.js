import { createStore, applyMiddleware } from 'redux';
import { serverError } from 'relient/middlewares';
import reducers from 'shared/reducers';
import { AUTHORIZATION } from 'shared/constants/cookie';
import fetchMiddleware from 'shared/middlewares/fetch';
import fetch from 'isomorphic-fetch/fetch-npm-node';
import { getWithBaseUrl } from 'relient/url';
import getConfig from 'relient/config';
import logger from './redux-logger';

export default ({ res, initialState = {} }) => createStore(
  reducers,
  initialState,
  applyMiddleware(
    fetchMiddleware({ fetch, apiDomain: getConfig('serverAPIDomain') }),
    serverError({
      onUnauthorized: () => {
        res.clearCookie(AUTHORIZATION);
        res.redirect(302, getWithBaseUrl('/auth/login', getConfig('baseUrl')));
      },
    }),
    logger,
  ),
);
