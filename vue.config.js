/* eslint-disable @typescript-eslint/no-var-requires */
const childProcess = require('child_process');
const packageInfo = require('./package.json');

const commit = childProcess
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    disableHostCheck: true,
    https: process.env.DEV_HTTPS === 'true',
    host: '0.0.0.0',
    public: process.env.DEV_PUBLIC_URL,
    proxy: {
      [process.env.VUE_APP_API_NAMESPACE]: {
        target: process.env.VUE_APP_PROXY,
        changeOrigin: true,
        logLevel: 'debug',
        // if the backend sets the domain, rewrite it
        cookieDomainRewrite: {
          // [process.env.VUE_APP_PROXY]: process.env.DEV_PUBLIC_URL,
        },
        onProxyReq(proxyReq, req) {
          if (req.headers.referer) {
            const { referer } = req.headers;
            const newReferer = `${process.env.VUE_APP_PROXY}${
              new URL(referer).pathname
            }`;
            console.log(`referer ${referer} => ${newReferer}`);
            proxyReq.setHeader('referer', newReferer);
          }
        },
      },
    },
  },
  chainWebpack: config => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    config.plugin('define').tap(([defs, ..._]) => {
      return [
        {
          'process.env.VUE_APP_VERSION': JSON.stringify(packageInfo.version),
          'process.env.VUE_APP_COMMIT': JSON.stringify(commit),
          ...defs,
        },
      ];
    });
    config.plugin('html').tap(args => {
      args[0].title = 'RCP';
      return args;
    });
  },
  publicPath: '/dashboard/',
};
