"use strict";
const helpers = require('./utils/helpers');
let env = helpers.getEnv();
const resourcesInfo = helpers.getResourcesInfo(helpers.getEnv());
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = (require('./webpack-dev.js'))(env);
const customSettings = require(resourcesInfo.settingsFilepath);
const HOST = customSettings.build.devServer.host || '0.0.0.0';
const PORT = customSettings.build.devServer.port || 3000;
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
    contentBase: helpers.root(''),
    outputPath: helpers.root('prod')
};

let app = new WebpackDevServer(webpack(config), webpackDevServerOptions);

app.listen(PORT, HOST, function (err) {
    if (err) {
        throw err;
    }

    console.info(`Listening at http://${HOST}:${PORT}`);
});
