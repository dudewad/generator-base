const execSync = require('child_process').execSync;
const cOut = require('../build-utils/customOutput');

module.exports = function(env, resourcesRoot, settingsFilename) {
	let execCmd = `grunt build:${env} --resourcesRoot=${resourcesRoot} --settings=${settingsFilename}`;

	try {
		execSync(execCmd, {stdio: 'inherit'});
	}
	catch (e) {
		console.log(cOut.fatal(`Build failed! Bad resourceRoot or settings filename. Tried using: \nresources-root: "${resourcesRoot}"\nsettings: "${settingsFilename}"`));
		process.exit();
	}
};