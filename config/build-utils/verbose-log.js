function VerboseLog(componentName) {
    this.componentName = componentName || '';
}

VerboseLog.prototype = {
    enable: function() {
        this.verbose = true;
        this.log('Verbose mode enabled.');
    },

    disable: function() {
        this.verbose = false;
        this.log('Verbose mode disabled.');
    },

    log: function() {
        this.verbose && console.log(`[${this.componentName}] - `, ...arguments);
    }
};

module.exports = VerboseLog;