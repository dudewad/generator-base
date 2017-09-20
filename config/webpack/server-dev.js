"use strict";

//Allow Node module aliasing, configured in package.json at _moduleAliases and _moduleDirectories
require('module-alias/register');

const helpers = require('@webpack-common/helpers');
let env = helpers.getEnv();
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = (require('./webpack-dev.js'))(env);
const appSettings = (require('@webpack-common/runtime.cfg'))(env).appSettings;
const HOST = appSettings.build.devServer.host || '0.0.0.0';
const PORT = appSettings.build.devServer.port || 3000;
config.entry.app = [config.entry.app];
config.entry.app.unshift(`webpack-dev-server/client?http://${HOST}:${PORT}/`, `webpack/hot/dev-server`);

/**
 * Webpack Development Server configuration
 * Description: The webpack-dev-server is a little node.js Express server.
 * The server emits information about the compilation state to the client,
 * which reacts to those events.
 *
 * See: https://webpack.github.io/docs/webpack-dev-server.html
 */
const webpackDevServerOptions = {
    historyApiFallback: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    stats: {
        colors: true,
        errorDetails: true,
        cached: true,
        chunks: false
    },
    contentBase: helpers.joinPathFromRoot(''),
    outputPath: helpers.joinPathFromRoot('prod')
};

let app = new WebpackDevServer(webpack(config), webpackDevServerOptions);

app.listen(PORT, HOST, function (err) {
    if (err) {
        throw err;
    }

    console.info(`Listening at http://${HOST}:${PORT}`);
});
