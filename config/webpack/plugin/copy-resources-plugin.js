const path = require('path');
const fs = require('fs-extra');
const chokidar = require('chokidar');
const verboseLog = new (require('@build-utils/verbose-log'))('CopyResourcesPlugin');

function CopyResourcesPlugin(cfg) {
    this.cfg = cfg;
    this.resolvedSrc = path.resolve(cfg.src);
    this.destFiles = [];

    cfg.verbose && verboseLog.enable();
}

CopyResourcesPlugin.prototype = {
    apply: function (compiler) {
        let that = this;
        this.compiler = compiler;

        compiler.plugin('after-plugins', () => {
            console.log('Copying all resources from resource root...');
            try {
                fs.copySync(this.cfg.src, this.cfg.dest, {
                    filter: (src, dest) => {
                        let stat;

                        try {
                            stat = fs.statSync(dest);
                        }
                        catch(e) {}

                        if (stat && !stat.isDirectory()) {
                            this.destFiles.push(path.resolve(dest));
                        }
                        return true;
                    }
                });
                console.log('All files successfully copied from resources directory.');
                that.watch(compiler);
            }
            catch (err) {
                console.log('There was an error copying all resource files. Details are below.\n', err);
            }
        });

        compiler.plugin('after-compile', (compilation, cb) => {
            let newFiles = this.destFiles;
            let f;

            for (let i = 0, len = newFiles.length; i < len; i++) {
                f = newFiles[i];

                if (compilation.fileDependencies.indexOf(f) === -1) {
                    compilation.fileDependencies.push(f);
                }
            }

            cb();
        })
    },

    watch: function () {
        this.watcher = chokidar.watch(this.cfg.src, {
            ignoreInitial: true,
            ignored: /.*___jb.*!/g, //Ignore jetbrains temporary files in case the user is modifying files from the IDE
            persistent: true
        });

        this.watcher
            .on('add', path => this.doCopy(path))
            .on('change', path => this.doCopy(path))
            .on('unlink', path => this.doUnlink(path))
            .on('error', error => 'Silent failure for now...');
    },

    doCopy: function (filename) {
        let targets = this.resolveSrcDestObj(filename);

        return new Promise((resolve, reject) => {
            fs.copy(targets.src, targets.dest, {replace: true})
                .then(() => {
                    verboseLog.log('Updated file copied from source: ', filename);
                    resolve(targets.dest);
                    this.doRecompile();
                })
                .catch(err => {
                    reject();
                    console.log('There was an error copying a changed resource file. Details are below.\n', err);
                })
        });
    },

    doUnlink: function (filename) {
        let targets = this.resolveSrcDestObj(filename);

        fs.unlink(targets.dest)
            .then(() => {
                verboseLog.log('File removed from source. Also removed from dest: ', filename);
                this.destFiles.splice(this.destFiles.indexOf(path.resolve(filename)), 1);
                this.doRecompile();
            })
            .catch(() => {
                console.log('There was an error removing a changed resource file. Details are below.\n', err);
            });
    },

    doRecompile: function() {
        this.compiler.run(() => {});
    },

    resolveSrcDestObj: function (filename) {
        let relPath = path.relative(this.resolvedSrc, path.resolve(filename));

        return {
            src: path.resolve(this.cfg.src, relPath),
            dest: path.resolve(this.cfg.dest, relPath)
        }
    }
};

module.exports = CopyResourcesPlugin;