"use strict";

const webpack = require('webpack');
const TsLoader = require('awesome-typescript-loader');
const TsConfigPathsPlugin = TsLoader.TsConfigPathsPlugin;
const helpers = require('@webpack-common/helpers');
const runtimeCfg = require('@webpack-common/runtime.cfg');
const buildTools = require('@webpack-common/build-tools');

/**
 * Plugins
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyResourcesPlugin = require('@webpack-plugin/copy-resources-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const SassOverridesPlugin = require('@webpack-plugin/sass-overrides-plugin');
const WebfontPlugin = require('webpack-webfont').default;

/**
 * Webpack configuration
 *
 * See: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function (env) {
    let cfg = runtimeCfg(env);
    let wfpCfg = buildTools.getWebfontPluginCfg(cfg);
    let plugins = [
        /*new CleanWebpackPlugin(
            [path.join(pkg.directories.sassGeneratedRoot, "overrides")],
            {
                root: helpers.joinPathFromRoot()
            }
        ),*/
        new DefinePlugin({
            'BREAKPOINT': cfg.breakpoint,
            'ENV': JSON.stringify(cfg.ENV),
            'VERSION': JSON.stringify(cfg.version),
            'CONTENT_ROOT': JSON.stringify(cfg.path.contentRoot),
            'DATA_ROOT': JSON.stringify(cfg.path.dataRoot),
            'FONT_RELATIVE_PATH': JSON.stringify(cfg.appSettings.url.relative.font),
            'IMAGE_RELATIVE_PATH': JSON.stringify(cfg.appSettings.url.relative.image),
            'process.env': {
                'ENV': JSON.stringify(cfg.ENV),
                'NODE_ENV': JSON.stringify(cfg.ENV)
            }
        }),
        new CopyResourcesPlugin
        ({
            src: cfg.path.resrcSrc,
            dest: cfg.path.resrcRoot,
            verbose: true
        }),
        new SassOverridesPlugin(cfg, true),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            chunksSortMode: 'dependency',
            filename: 'index.html',
            template: 'index.html'
        })
    ];

    if(wfpCfg) {
        plugins.push(new WebfontPlugin(wfpCfg));
    }

    return {
        devServer: {inline: true},
        entry: {
            'app': './app/main.browser.ts'
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
                    exclude: [helpers.joinPathFromRoot('index.html')]
                }
            ]
        },
        node: {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        },
        plugins,
        resolve: {
            extensions: ['.ts', '.js'],
            modules: [helpers.joinPathFromRoot('app'), 'node_modules'],
            alias: {
                'test': __dirname
            },
            plugins: [
                new TsConfigPathsPlugin()
            ]
        }
    }
};
