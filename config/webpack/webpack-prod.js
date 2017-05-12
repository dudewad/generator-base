"use strict";

const path = require('path');
const helpers = require('./utils/helpers');
const webpackMerge = require('webpack-merge');
const webpack = require('webpack');
const commonConfig = require('./webpack-common');
const getCommonMetadata = require('./common-metadata');
const runGrunt = require('./runGrunt');
const integrationTools = require('./utils/integration-tools');

/**
 * Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ProvidePlugin = require('webpack/lib/ProvidePlugin');
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'production';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (env) {
	//Preflight tasks
	integrationTools.copyResourcesToTemp(env);

	const commonMetadata = getCommonMetadata(env);
	const customSettings = require(commonMetadata.settingsFilepath);
	const metadata = webpackMerge(commonMetadata, {
		ENV: ENV,
		CONTENT_ROOT: customSettings.url.prod.contentRoot,
		DATA_ROOT: customSettings.url.prod.dataRoot
	});
	const resRoot = metadata.resourcesRoot;
	const outputBase = path.join(helpers.root(env.resourcesRoot, customSettings.build.outputBase.prod));
	const paths = {
		input: {
			contentRoot: path.join(resRoot, customSettings.resources.contentRoot),
			dataRoot: path.join(resRoot, customSettings.resources.dataRoot)
		},
		output: {
			content: path.join(outputBase, 'asset'),
			site: path.join(outputBase, 'site'),
			siteData: path.join(outputBase, 'site', 'site-data')
		}
	};
	const style = customSettings.style;
	integrationTools.importStyleOverrides(path.join(resRoot, style.overridesBaseDir), style.overridesEntryPoint);
	runGrunt(ENV, resRoot, metadata.settingsFilename);

	return webpackMerge(commonConfig(env), {
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
			path: paths.output.site,
			filename: '[name].bundle.js',
			sourceMapFilename: '[file].map',
			chunkFilename: '[id].chunk.js'
		},
		plugins: [
			new CopyWebpackPlugin([
				{
					from: paths.input.contentRoot,
					to: paths.output.content,
					ignore: ['**/src/*']
				},
				{
					from: paths.input.dataRoot,
					to: paths.output.siteData
				},
				{
					from: path.join(resRoot, customSettings.server.htaccess),
					to: paths.output.site
				}
			]),

			new DefinePlugin({
				'BREAKPOINT': metadata.BREAKPOINT,
				'ENV': JSON.stringify(metadata.ENV),
				'VERSION': JSON.stringify(metadata.version),
				'VERSION_DTM': JSON.stringify(metadata.versionDtm),
				'CONTENT_ROOT': JSON.stringify(metadata.CONTENT_ROOT),
				'DATA_ROOT': JSON.stringify(metadata.DATA_ROOT),
				'FONT_RELATIVE_PATH': JSON.stringify(metadata.FONT_RELATIVE_PATH),
				'IMAGE_RELATIVE_PATH': JSON.stringify(metadata.IMAGE_RELATIVE_PATH),
				'process.env': {
					'ENV': JSON.stringify(metadata.ENV),
					'NODE_ENV': JSON.stringify(metadata.ENV)
				}
			}),

			new UglifyJsPlugin({
				beautify: false,
				mangle: {
					screw_ie8: true,
					keep_fnames: true
				},
				compress: {
					screw_ie8: true,
					warnings: false
				},
				comments: false,
			})
		]
	});
};
