"use strict";

const path = require('path');
const helpers = require('./utils/helpers');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack-common');
const getCommonMetadata = require('./common-metadata');
const runGrunt = require('./runGrunt');
const integrationTools = require('./utils/integration-tools');
const pkg = require(helpers.root() + '/package.json');
const urlJoin = require('url-join');

/**
 * Plugins
 */
const DefinePlugin = require('webpack/lib/DefinePlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'development';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(env) {
	//Preflight tasks
	integrationTools.copyResourcesToTemp(env);
	let tempBase = pkg.directories.webpackTempBuildBase;

	const commonMetadata = getCommonMetadata(env, true);
	const customSettings = require(commonMetadata.settingsFilepath);
	const metadata = webpackMerge(commonMetadata, {
		ENV,
		CONTENT_ROOT: urlJoin(tempBase, customSettings.url.dev.contentRoot),
		DATA_ROOT: urlJoin(tempBase, customSettings.url.dev.dataRoot)
	});
	const resRoot = metadata.resourcesRoot;
	const style = customSettings.style;
	integrationTools.importStyleOverrides(path.join(resRoot, style.overridesBaseDir), style.overridesEntryPoint);
	runGrunt(resRoot, metadata.settingsFilename);

	return webpackMerge(commonConfig(env), {
		devServer: {inline: true},
		entry: {
			'app': './app/main.browser.ts'
		},
		module: {
			rules: [{
				test: /\.scss$/,
				use: [{
					loader: "raw-loader"
				}, {
					loader: 'postcss-loader?config=config/webpack/postcss.config.js'

				}, {
					loader: "sass-loader",
					options: {
						data: commonMetadata.sassLoaderBaseData + ';$env: "' + ENV + '";'
						+ '$urlContentRoot: "' + metadata.CONTENT_ROOT + '";'
						+ '$urlFontRelativePath: "' + metadata.FONT_RELATIVE_PATH + '";'
						+ '$urlImageRelativePath: "' + metadata.IMAGE_RELATIVE_PATH + '";'
					}
				}]
			}]
		},
		node: {
			global: true,
			crypto: 'empty',
			process: true,
			module: false,
			clearImmediate: false,
			setImmediate: false
		},
		output: {
			path: helpers.root('dev/'),
			filename: '[name].bundle.js',
			sourceMapFilename: '[file].map',
			chunkFilename: '[id].chunk.js'
		},
		plugins: [
			new webpack.HotModuleReplacementPlugin(),
			new HtmlWebpackPlugin({
				chunksSortMode: 'dependency',
				filename: 'index.html',
				template: 'index.html'
			}),
			new DefinePlugin({
				'BREAKPOINT': metadata.BREAKPOINT,
				'ENV': JSON.stringify(metadata.ENV),
				'VERSION': JSON.stringify(metadata.version + '-dev'),
				'VERSION_DTM': JSON.stringify(metadata.versionDtm),
				'CONTENT_ROOT': JSON.stringify(metadata.CONTENT_ROOT),
				'DATA_ROOT': JSON.stringify(metadata.DATA_ROOT),
				'FONT_RELATIVE_PATH': JSON.stringify(metadata.FONT_RELATIVE_PATH),
				'IMAGE_RELATIVE_PATH': JSON.stringify(metadata.IMAGE_RELATIVE_PATH),
				'process.env': {
					'ENV': JSON.stringify(metadata.ENV),
					'NODE_ENV': JSON.stringify(metadata.ENV)
				}
			})
		]
	});
};
