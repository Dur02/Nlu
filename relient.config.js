export default {
  babelPlugins: [
    ['import', { libraryName: 'antd', style: false }],
    ['lodash', { id: ['lodash'] }],
  ],
  baseUrl: '/',
  proxies: [{
    from: ['/images/icons'],
    target: 'http://test-dds.aitekapp.com:8082',
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/api': '',
    // },
  }, {
    from: ['/nlu/edit'],
    target: 'http://localhost:9001',
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/api': '',
    // },
  }],
};
