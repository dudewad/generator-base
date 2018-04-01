const fs = require('fs-extra');
const verboseLog = new (require('@build-utils/verbose-log'))('SassFontImportsPlugin');

function SassFontImportsPlugin(cfg) {
    this.cfg = cfg;

    cfg.verbose && verboseLog.enable();
}

SassFontImportsPlugin.prototype = {
    apply: function (compiler) {
        let cfg = this.cfg;

        compiler.plugin(['run', 'watch-run'], (compilation, cb) => {
            verboseLog.log('RUNNING SASS_FONT_IMPORTS_PLUGIN');
            let imports = cfg.fonts.reduce((accumulator, font) => font.generated ? `${accumulator}@import "./${font.name}";\n` : accumulator, '');

            verboseLog.log('Writing SCSS imports file to', cfg.output);

            fs.outputFile(cfg.output, imports, err => {
                if (err) {
                    throw new Error(`Couldn't write font scss file! Aborting.\n`, err);
                }
                verboseLog.log('SCSS imports file successfully written!');
                cb();
            });
        });

        compiler.plugin('after-emit', (compilation, cb) => {
            let watchFiles = compilation.fileDependencies;

            if(watchFiles.indexOf(cfg.output) !== -1 ) {
                watchFiles.splice(watchFiles.indexOf(cfg.output), 1);
            }
            cb();
        })
    }
};

module.exports = SassFontImportsPlugin;