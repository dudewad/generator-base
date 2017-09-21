"use strict";

//Allow Node module aliasing, configured in package.json at _moduleAliases and _moduleDirectories
require('module-alias/register');

process.env.ENV = process.env.NODE_ENV = 'prod';

module.exports = require('@webpack-common/webpack.dist.cfg');
