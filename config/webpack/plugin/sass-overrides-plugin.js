const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const verboseLog = new (require('@build-utils/verbose-log'))('SassOverridesPlugin');

function SassOverridesPlugin(cfg, verbose) {
    this.cfg = cfg;
    this.targetSrcDir = path.resolve(
        cfg.path.resrcRoot,
        cfg.appSettings.style.overridesBaseDir
    );
    this.targetOutputDir = path.resolve(
        cfg.path.pkgJsonDirs.sassGeneratedRoot,
        cfg.path.pkgJsonDirs.sassOverridesBase
    );
    this.skip = false;

    verbose && verboseLog.enable();
}

SassOverridesPlugin.prototype = {
    apply: function (compiler) {
        let that = this;

        compiler.plugin("invalid", function (filename) {
            let outputFiles = glob.sync(path.join(that.targetOutputDir, '**/*')).map(fPath => {
                return path.normalize(fPath);
            });

            if(outputFiles.indexOf(path.normalize(filename)) !== -1) {
                that.skip = true;
            }
        });
        compiler.plugin(['run', 'watch-run'], (compilation, cb) => {
            if(that.skip) {
                that.skip = false;
                verboseLog.log('Skipping style override update since no files changed.');
                cb();
                return;
            }
            this.copySourceOverrides()
                .then(
                    this.sealOverridesFile.bind(this),
                    err => {
                        throw err;
                    })
                .then(() => {
                        verboseLog.log('Style overrides have been fully merged.');
                        cb();
                    },
                    err => {
                        throw err;
                    });
        });
    },

    copySourceOverrides() {
        return new Promise((resolve, reject) => {
            fs.copy(this.targetSrcDir, this.targetOutputDir, err => {
                if (err) {
                    reject(err);
                }
                verboseLog.log('Source style overrides were successfully copied.');
                resolve();
            });
        });
    },

    sealOverridesFile: function() {
        return new Promise((resolve, reject) => {
            fs.rename(
                path.resolve(
                    this.targetOutputDir,
                    this.cfg.appSettings.style.overridesEntryPoint
                ),
                path.resolve(
                    this.targetOutputDir,
                    this.cfg.path.pkgJsonResrc.sassOverridesEntryPoint
                ),
                err => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
        });
    }
};

module.exports = SassOverridesPlugin;