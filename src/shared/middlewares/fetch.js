import { getEntity } from 'relient/selectors';
import { fetch as fetchMiddleware } from 'relient/middlewares';

export default ({ fetch, apiDomain }) => fetchMiddleware({
  fetch,
  apiDomain,
  getDefaultHeader: ({ getState, withoutAuth }) => {
    const state = getState();
    return {
      ...(withoutAuth ? {} : {
        Cookie: `JSESSIONID=${getEntity('auth.authorization')(state)}`,
      }),
    };
  },
});
