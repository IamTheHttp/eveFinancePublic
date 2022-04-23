let path = require('path');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: ['core-js/stable',
    `webpack-dev-server/client?http://127.0.0.1:8000`,
    'webpack/hot/only-dev-server',
    `${process.cwd()}/src/frontend/develop.tsx`
  ],
  cache: true,
  output: {
    filename: 'index.js'
  },
  devServer: {
    contentBase: './frontend/src/',
    historyApiFallback: true,
    hot: true,
    port: 8000,
    noInfo: false,
    stats: 'minimal'
  },
  devtool: 'inline-source-map',
  performance: {
    hints: false
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'bundle.css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/, // both .js and .jsx
        loader: 'eslint-loader',
        include: path.resolve(process.cwd(), 'src/frontend'),
        enforce: 'pre',
        options: {
          configFile: '.eslintrc'
        }
      },
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
    ]
  }
};
