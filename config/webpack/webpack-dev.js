"use strict";

const webpackMerge = require('webpack-merge');
const helpers = require('@webpack-common/helpers');
const runtimeCfg = require('@webpack-common/runtime.cfg');
const webpackCommonCfg = require('@webpack-common/webpack.cfg');

/**
 * Plugins
 */
const AutoPrefixer = require('autoprefixer');

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'dev';

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
        output: {
            path: helpers.joinPathFromRoot('dev/'),
            filename: '[name].bundle.js',
            sourceMapFilename: '[file].map',
            chunkFilename: '[id].chunk.js'
        }
    });
};
