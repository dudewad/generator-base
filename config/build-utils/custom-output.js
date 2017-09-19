let styles = {
	foreground: {
		default: '39',
		black: '30',
		red: '31',
		green: '32',
		yellow: '33',
		blue: '34',
		magenta: '35',
		cyan: '36',
		lightGray: '37',
		darkGray: '90',
		lightRed: '91',
		lightGreen: '92',
		lightYellow: '93',
		lightBlue: '94',
		lightMagenta: '95',
		lightCyan: '96',
		white: '97'
	},
	background: {
		default: '49',
		black: '40',
		red: '41',
		green: '42',
		yellow: '43',
		blue: '44',
		magenta: '45',
		cyan: '46',
		lightGray: '47',
		darkGray: '100',
		lightRed: '101',
		lightGreen: '102',
		lightYellow: '103',
		lightBlue: '104',
		lightMagenta: '105',
		lightCyan: '106',
		white: '107'
	},
	format: {
		bold: '1',
		underline: '4',
		dim: '2'
	}
};

function setStyle (str, options) {
	let styleDeclaration;
	let prefix = '\x1B[';
	let close = '\x1B[0m';
	let suffix = 'm';
	let fg = options.fg;
	let bg = options.bg;
	let styledItems = [];

	if (options.bold) {
		styledItems.push(styles.format.bold);
	}
	if (options.underline) {
		styledItems.push(styles.format.underline);
	}
	if (options.dim) {
		styledItems.push(styles.format.dim);
	}
	if (fg && styles.foreground.hasOwnProperty(fg)) {
		styledItems.push(styles.foreground[fg]);
	}
	if (bg && styles.background.hasOwnProperty(bg)) {
		styledItems.push(styles.background[bg]);
	}

	styleDeclaration = prefix + styledItems.join(';') + suffix;

	return styleDeclaration + str + close;
}

function warn (str) {
	return setStyle(str, {
		fg: 'yellow',
		bold: true
	})
}

function critical (str) {
	return setStyle(str, {
		fg: 'white',
		bg: 'red',
		bold: true
	})
}

function fatal (str) {
	return setStyle(str, {
		fg: 'red',
		bold: true
	})
}

function success (str) {
	return setStyle(str, {
		fg: 'green'
	})
}

function info (str) {
	return setStyle('\n ' + str + ' \n', {
		fg: 'lightBlue',
		bg: 'white'
	})
}

function hashBlock(str) {
	let hashes = new Array(str.length).join('#');
	return '\n' + hashes + '\n' + str + '\n' + hashes + '\n';
}

module.exports = {
	critical: critical,
	fatal: fatal,
	hashBlock: hashBlock,
	info: info,
	setStyle: setStyle,
	success: success,
	warn: warn
};