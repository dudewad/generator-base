const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const verboseLog = new (require('@build-utils/verbose-log'))('SassOverridesPlugin');

function SassOverridesPlugin(cfg, verbose) {
    verbose && verboseLog.enable();

    this.cfg = cfg;
    this.skip = false;
    this.targetOutputDir = path.resolve(
        cfg.path.pkgJsonDirs.sassGeneratedRoot,
        cfg.path.pkgJsonDirs.sassOverridesBase
    );

    if(cfg.appSettings
        && cfg.appSettings.style
        && cfg.appSettings.style.overridesBaseDir
        && cfg.appSettings.style.overridesEntryPoint) {
        this.targetSrcDir = path.resolve(
            cfg.path.resrcRoot,
            cfg.appSettings.style.overridesBaseDir
        );
        this.hasOverrides = true;
    }
}

SassOverridesPlugin.prototype = {
    apply: function (compiler) {
        let that = this;

        if(!this.hasOverrides) {
            this.patchMissingOverrides();
            return;
        }

        compiler.plugin('invalid', function (filename) {
            let outputFiles = glob.sync(path.join(that.targetOutputDir, '**/*')).map(fPath => {
                return path.normalize(fPath);
            });

            if(outputFiles.indexOf(path.normalize(filename)) !== -1) {
                that.skip = true;
            }
        });
        compiler.plugin(['run', 'watch-run'], (compilation, cb) => {
            verboseLog.log('RUNNING SASS_OVERRIDES_PLUGIN');
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
    },

    patchMissingOverrides: function() {
        try {
            fs.outputFileSync(
                path.resolve(
                    this.targetOutputDir,
                    this.cfg.path.pkgJsonResrc.sassOverridesEntryPoint
                ), '/* No overrides were found because the settings object has no "style" property. Refer to the readme for how the settings file should be structured if you believe this is an error. */');
            verboseLog.log('No custom style overrides defined - Generated empty overrides file instead.');
        }
        catch(err) {
            verboseLog.log('No custom style overrides defined - Failed to generate empty overrides file!!!', err);
        }
    }
};

module.exports = SassOverridesPlugin;