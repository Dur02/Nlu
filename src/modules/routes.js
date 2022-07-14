const routes = [
  {
    path: '/auth',
    chunks: ['auth'],
    load: () => import(/* webpackChunkName: 'auth' */ 'modules/auth'),
  },

  {
    path: '/skill',
    chunks: ['skill'],
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'skill' */ 'modules/skill'),
  },

  {
    path: '/system',
    chunks: ['system'],
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'system' */ 'modules/system'),
  },

  {
    path: '/audit',
    chunks: ['audit'],
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'audit' */ 'modules/audit'),
  },

  {
    path: '/intervention',
    chunks: ['intervention'],
    requireAuth: true,
    load: () => import(/* webpackChunkName: 'audit' */ 'modules/intervention'),
  },

  {
    path: '/',
    chunks: ['product'],
    requireAuth: true,
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
