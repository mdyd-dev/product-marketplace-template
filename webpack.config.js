const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackRequireFrom = require('webpack-require-from');

const prod = process.env.NODE_ENV === 'production';

const config = {
  entry: {
    app: './src/js/app',
  },
  output: {
    filename: 'js/[name].js?v=[chunkhash:5]',
    chunkFilename: 'js/[name].js?v=[chunkhash:5]',
    path: path.resolve('app/assets'),
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'app'),
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
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { url: false } }, 'postcss-loader'],
      },
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
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css?v=[chunkhash:5]',
    }),
    new WebpackRequireFrom({
      variableName: 'window.cdnUrl',
    }),
  ],
  mode: prod ? 'production' : 'development',
};

module.exports = config;
