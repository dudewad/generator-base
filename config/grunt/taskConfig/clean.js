/**
 * Grunt task configuration - clean
 */
module.exports = {
	clean: [
		'<%= pkg.directories.sassGeneratedRoot %>/**/*',
		'!<%= pkg.directories.sassGeneratedRoot %>/<%= pkg.resources.sassFontFileName %>'
	]
};
