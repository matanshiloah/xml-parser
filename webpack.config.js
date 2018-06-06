"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');

var plugins = [
	new webpack.optimize.UglifyJsPlugin({minimize: true}),
	new webpack.NoEmitOnErrorsPlugin(),
	new webpack.NamedModulesPlugin(),
	new webpack.HotModuleReplacementPlugin()
]

loaders.push({
	test: /\.(scss|ico)$/,
	loaders: ['babel-loader'],
	exclude: ['node_modules']
});

var conf = {
	entry: [ './xmlParser.js' ],
	resolve: { extensions: ['.js', '.jsx'] },
	module: { loaders },
	plugins: plugins,
	devtool: 'eval',
    output: {
		publicPath: '/',
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js'
	}
};

module.exports = [ conf ];
