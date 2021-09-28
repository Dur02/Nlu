export default {
  babelPlugins: [
    ['import', { libraryName: 'antd', style: false }],
    ['lodash', { id: ['lodash'] }],
  ],
  baseUrl: '/',
  proxy: {
    from: ['/user', '/nlueditor'],
    target: 'http://test-dds.aitekapp.com:8082',
    changeOrigin: true,
    logLevel: 'debug',
    // pathRewrite: {
    //   '^/api': '',
    // },
  },
};
