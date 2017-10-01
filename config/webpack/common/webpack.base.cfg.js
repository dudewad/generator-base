/**
 * This config is merged into all configurations. It contains any plugins and config common to every single other
 * configuration. If a plugin or setting you want to add doesn't belong everywhere, then it doesn't belong here.
 */

"use strict";

const buildTools = require('@webpack-common/build-tools');
const TsLoader = require('awesome-typescript-loader');
const helpers = require('@webpack-common/helpers');
const path = require('path');
const runtimeCfg = require('@webpack-common/runtime.cfg');
const webpack = require('webpack');

/**
 * Plugins
 */
const AutoPrefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyResourcesPlugin = require('@webpack-plugin/copy-resources-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const SassFontImportsPlugin = require('@webpack-plugin/sass-font-imports-plugin');
const SassOverridesPlugin = require('@webpack-plugin/sass-overrides-plugin');
const TsConfigPathsPlugin = TsLoader.TsConfigPathsPlugin;
const WebfontPlugin = require('webpack-webfont').default;

module.exports = function (env) {
    let plugins;
    let cfg = runtimeCfg(env);
    let wfpCfg = buildTools.getWebfontPluginCfg(cfg);
    let cleanTargets = [
        path.resolve(cfg.path.pkgJsonDirs.sassGeneratedRoot),
        path.resolve(cfg.path.pkgJsonDirs.webpackTempBuildBase)
    ];
    let faviconCfg = cfg.appSettings.resources.favicon;

    if(cfg.appSettings.build.outputBase[process.env.ENV]) {
        cleanTargets.push(path.resolve(cfg.path.resrcSrc, cfg.appSettings.build.outputBase[process.env.ENV]))
    }

    plugins = [
        new CleanWebpackPlugin(
            cleanTargets,
            {
                root: process.cwd()
            }
        ),
        new SassFontImportsPlugin({
            fonts: cfg.appSettings.font,
            output: path.resolve(cfg.path.pkgJsonDirs.sassGeneratedRoot + cfg.path.pkgJsonResrc.sassFontFileName),
            verbose: true
        }),
        new DefinePlugin({
            'BREAKPOINT': cfg.breakpoint,
            'ENV': JSON.stringify(process.env.ENV),
            'VERSION': JSON.stringify(cfg.version),
            'CONTENT_ROOT': JSON.stringify(cfg.path.contentRoot),
            'DATA_ROOT': JSON.stringify(cfg.path.dataRoot),
            'FONT_RELATIVE_PATH': JSON.stringify(cfg.appSettings.url.relative.font),
            'IMAGE_RELATIVE_PATH': JSON.stringify(cfg.appSettings.url.relative.image),
            'process.env': {
                'ENV': JSON.stringify(process.env.ENV),
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
    if (faviconCfg) {
        plugins.push(new FaviconsWebpackPlugin({
            logo: path.resolve(cfg.path.resrcRoot, faviconCfg.src),
            prefix: 'favicon-[hash]/',
            background: faviconCfg.background || '#FFF',
            title: faviconCfg.title || ''
        }));
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
                }, {
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
                            data: cfg.sassLoaderBaseData + ';$env: "' + process.env.ENV + '";'
                            + '$urlContentRoot: "' + cfg.path.contentRoot + '";'
                            + '$urlFontRelativePath: "' + cfg.appSettings.url.relative.font + '";'
                            + '$urlImageRelativePath: "' + cfg.appSettings.url.relative.image + '";'
                        }
                    }]
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
