const fs = require('fs-extra');
const glob = require('glob');
const njks = require('nunjucks');
const path = require('path');

const filters = require('@build-utils/nunjuks/filters');
const verboseLog = new (require('@build-utils/verbose-log'))('WebAppExtensionsPlugin');

function WebAppExtensionsPlugin(cfg) {
    let i, len;

    this.cfg = cfg;
    this.njksEnv = new njks.Environment(new njks.FileSystemLoader(cfg.templateRoot));
    this.hasChanges = true;
    this.objects = objs = {
        cmps: [],
        svcs: [],
        mdls: []
    };

    this.njksEnv.addFilter('ucFirst', filters.ucFirst);

    cfg.component = cfg.component || [];
    cfg.service = cfg.service || [];
    cfg.model = cfg.model || [];

    cfg.targetModuleFile = path.join(cfg.targetRoot, 'extensions.mod.ts');
    cfg.cmpRoot = path.join(cfg.targetRoot, 'component');
    cfg.svcRoot = path.join(cfg.targetRoot, 'service');
    cfg.mdlRoot = path.join(cfg.targetRoot, 'model');

    for (i = 0, len = cfg.component.length; i < len; i++) {
        objs.cmps.push(buildObject(cfg.component[i], 'cmp'));
    }
    for (i = 0, len = cfg.service.length; i < len; i++) {
        objs.svcs.push(buildObject(cfg.service[i], 'svc'));
    }
    for (i = 0, len = cfg.model.length; i < len; i++) {
        objs.mdls.push(buildObject(cfg.model[i], 'mdl'));
    }

    cfg.verbose && verboseLog.enable();
}

function buildObject(item, type) {
    let name = stripName(item);

    return {
        type,
        name,
        originalName: item,
        symbol: formatSymbol(name, type)
    }
}

function copyItems(items) {
    let cfg = this.cfg;
    let allItems = items.cmps.concat(items.svcs, items.mdls);

    for (let i = 0, len = allItems.length; i < len; i++) {
        let {name, type, originalName: oName} = allItems[i];

        try {
            fs.copySync(path.join(cfg.srcRoot, oName, `${name}.${type}.ts`), path.join(cfg.targetRoot, oName, `${name}.${type}.ts`));
            if (type === 'cmp') {
                fs.copySync(path.join(cfg.srcRoot, oName, `${name}.${type}.html`), path.join(cfg.targetRoot, oName, `${name}.${type}.html`));
                fs.copySync(path.join(cfg.srcRoot, oName, `${name}.${type}.scss`), path.join(cfg.targetRoot, oName, `${name}.${type}.scss`));
            }
        }
        catch (e) {
            console.error('Copy failed! Details follow:', e.toString());
        }
    }
}

function writeIndexFiles(items) {
    let cfg = this.cfg;

    fs.outputFileSync(
        path.join(cfg.cmpRoot, 'index.ts'),
        this.njksEnv.render(
            path.join(cfg.templateRoot, 'index.njk'),
            {items: items.cmps, type: 'cmp'}
        )
    );
    fs.outputFileSync(
        path.join(cfg.svcRoot, 'index.ts'),
        this.njksEnv.render(
            path.join(cfg.templateRoot, 'index.njk'),
            {items: items.svcs, type: 'svc'}
        )
    );
    fs.outputFileSync(
        path.join(cfg.mdlRoot, 'index.ts'),
        this.njksEnv.render(
            path.join(cfg.templateRoot, 'index.njk'),
            {items: items.mdls, type: 'mdl'}
        )
    );
}

function writeModule(items) {
    let cfg = this.cfg;

    fs.outputFileSync(
        cfg.targetModuleFile,
        this.njksEnv.render(
            path.join(cfg.templateRoot, 'extensions.mod.njk'),
            {items}
        )
    );
}

function formatSymbol(symbol, suffix){
    return ucFirst(symbol).concat('_').concat(ucFirst(suffix));
}

function ucFirst(str) {
    str = str.substr(0, 1).toUpperCase().concat(str.substr(1).toLowerCase());
    return str;
}

function stripName(item) {
    return item.split('/').pop();
}

WebAppExtensionsPlugin.prototype = {
    apply: function (compiler) {
        let cfg = this.cfg;

        compiler.plugin('invalid', filename => {
            let watchFiles = glob.sync(path.join(cfg.srcRoot, '**/*')).map(fPath => {
                return path.normalize(fPath);
            });
            console.log(watchFiles);

            this.hasChanges = watchFiles.indexOf(path.normalize(filename)) !== -1;
            verboseLog.log(`File change detected: ${filename}.`, this.hasChanges ? 'File included in watch files. Running.' : 'File not included in watch files. Skipping.');
        });

        compiler.plugin(['run', 'watch-run'], (compilation, cb) => {
            if(!this.hasChanges) {
                verboseLog.log('Skipping: no changes detected.');
                cb();
                return;
            }

            copyItems.call(this, this.objects);
            writeIndexFiles.call(this, this.objects);
            writeModule.call(this, this.objects);

            this.hasChanges = false;
            cb();
        });
    }
};

module.exports = WebAppExtensionsPlugin;