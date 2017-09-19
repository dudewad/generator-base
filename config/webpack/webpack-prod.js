"use strict";

//Allow Node module aliasing, configured in package.json at _moduleAliases and _moduleDirectories
require('module-alias/register');

const webpackMerge = require('webpack-merge');
const path = require('path');
const runtimeCfg = require('@webpack-common/runtime.cfg');
const webpackCommonCfg = require('@webpack-common/webpack.cfg');

/**
 * Plugins
 */
const AutoPrefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'prod';

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (env) {
    let cfg = runtimeCfg(env);

    return webpackMerge(webpackCommonCfg(env), {
        module: {
            rules: [{
                test: /\.scss$/,
                use: [{
                    loader: "raw-loader"
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [AutoPrefixer()]
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        data: cfg.sassLoaderBaseData + ';$env: "' + ENV + '";'
                        + '$urlContentRoot: "' + cfg.path.contentRoot + '";'
                        + '$urlFontRelativePath: "' + cfg.appSettings.url.relative.font + '";'
                        + '$urlImageRelativePath: "' + cfg.appSettings.url.relative.image + '";'
                    }
                }]
            }]
        },
        plugins: [
            new UglifyJsPlugin(),
            new CopyWebpackPlugin([
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.resources.contentRoot),
                    to: cfg.path.outputBaseAsset,
                    ignore: ['**/src/*']
                },
                {
                    from: path.resolve(cfg.path.resrcRoot, cfg.appSettings.resources.dataRoot),
                    to: cfg.path.outputBaseSiteData
                }/*,
                {
                    from: path.join(resRoot, customSettings.server.htaccess),
                    to: paths.output.site
                }*/
            ])
        ],
        output: {
            path: cfg.path.outputBaseSite,
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkFilename: '[id].chunk.js'
        }
    });
};
