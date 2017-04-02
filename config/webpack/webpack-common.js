"use strict";

const fs = require("fs-extra");
const path = require('path');
const helpers = require('./utils/helpers');
const webpack = require('webpack');
const pkg = require(helpers.root() + '/package.json');

/**
 * Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (env) {
	return {
		devServer: {inline: true},
		entry: {
			'vendor': ['./app/vendor.ts'],
			'app': ['./app/polyfills.ts', './app/main.browser.ts']
		},
		module: {
			exprContextCritical: false,
			rules: [
				{
					test: /\.ts$/,
					use: [{
						loader: 'awesome-typescript-loader'
					}]
				},
				{
					test: /\.html$/,
					use: [{
						loader: 'raw-loader'
					}],
					exclude: [helpers.root('index.html')]
				}
			]
		},
		node: {
			global: 'window',
			crypto: 'empty',
			process: true,
			module: false,
			clearImmediate: false,
			setImmediate: false
		},
		plugins: [
			new CleanWebpackPlugin(
				[path.join(pkg.directories.sassGeneratedRoot, "overrides")],
				{
					root: helpers.root()
				}
			),
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				chunksSortMode: 'dependency',
				filename: 'index.html',
				template: 'index.html'
			})
		],
		resolve: {
			extensions: ['.ts', '.js'],
			modules: ['node_modules'],
			alias: {}
		}
	}
};
