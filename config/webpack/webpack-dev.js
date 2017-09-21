"use strict";

const webpackBaseCfg = require('@webpack-common/webpack.base.cfg');

process.env.ENV = process.env.NODE_ENV = 'dev';

module.exports = function (env) {
    return webpackBaseCfg(env);
};
