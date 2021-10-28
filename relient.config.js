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
    from: ['/skill/edit'],
    target: 'http://editor-dev.aitekapp.com:7443',
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/api': '',
    // },
  }],
};
