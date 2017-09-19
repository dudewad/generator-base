function VerboseLog() {}

VerboseLog.prototype = {
    enable: function() {
        this.verbose = true;
    },

    disable: function() {
        this.verbose = false;
    },

    log: function() {
        this.verbose && console.log(...arguments);
    }
};

module.exports = VerboseLog;