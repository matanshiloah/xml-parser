"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');

loaders.push({
  test: /\.(scss|ico)$/,
  loaders: ['style-loader', 'css-loader?importLoaders=1', 'sass-loader'],
  exclude: ['node_modules']
});

module.exports = {
    entry: [
      './xmlParser.js' // your app's entry point
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      libraryTarget: "umd"
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    module: {
      rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }
      ]
    },
    devServer: {
      contentBase: "./public",
      // do not print bundle build stats
      noInfo: true,
      // enable HMR
      hot: true,
      // embed the webpack-dev-server runtime into the bundle
      inline: true,
      // serve index.html in place of 404 responses to allow HTML5 history
      historyApiFallback: true
    },
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin()
    ],
    mode: 'none'
  };
