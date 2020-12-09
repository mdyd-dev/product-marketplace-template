const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackRequireFrom = require('webpack-require-from');

const prod = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    chat: './src/js/chat',
    notifications: './src/js/notifications'
  },
  output: {
    filename: 'js/[name].js?v=[chunkhash:5]',
    chunkFilename: 'js/[name].js?v=[chunkhash:5]',
    path: path.resolve('public/assets'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'chat'),
    watchContentBase: true,
    writeToDisk: true,
    open: true,
  },
  bail: true,
  performance: { hints: false },
  stats: {
    assetsSort: '!size',
    builtAt: false,
    children: false,
    modules: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
      }
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true,
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: false, // Do not emit vendors~* files that are almost empty in this setup
      },
    },
  },
  plugins: [
    new WebpackRequireFrom({
      variableName: 'window.cdnUrl',
    }),
  ],
  mode: prod ? 'production' : 'development',
};

module.exports = config;
