const routes = [
  {
    path: '/auth',
    chunks: ['auth'],
    load: () => import(/* webpackChunkName: 'auth' */ 'modules/auth'),
  },

  {
    path: '/',
    chunks: ['product'],
    // requireAuth: true,
    load: () => import(/* webpackChunkName: 'product' */ 'modules/product'),
  },

  {
    path: '/(.*)',
    chunks: ['not-found'],
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'not-found' */ 'modules/not-found'),
  },
];

// The error page is available by permanent url for development mode
if (__DEV__) {
  routes.unshift({
    path: '/error',
    // eslint-disable-next-line global-require
    action: require('./error').default,
  });
}

export default routes;
