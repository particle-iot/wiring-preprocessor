'use strict';
const fs = require('fs');
const regexParser = require('./regexParser.js');
const utilities = require('./utilities.js');

function processFile(inputFile, content) {
	// Skip files with PARTICLE_NO_PREPROCESSOR
	const noPreprocessorIdx = regexParser.getNoPreprocessor(content);
	if (noPreprocessorIdx >= 0) {
		// Comment out the fake pragma to avoid GCC warning
		content = utilities.stringInsert(
			content,
			noPreprocessorIdx,
			'// '
		);
		return content;
	}

	// Check if application.h is already included
	const appIncludeIdx = regexParser.getApplicationInclude(content);

	// Add function prototypes after other includes
	let prototypesIdx = regexParser.getFirstStatement(content);

	// If prototype position would be before existing application.h move it to later
	if (appIncludeIdx > prototypesIdx) {
		prototypesIdx = content.indexOf('\n', appIncludeIdx) + 1;
	}

	// Add a #line preprocessor instruction to sync the errors with the original code
	const linesBeforeInjection = content.substring(0, prototypesIdx).split('\n').length;

	// Add function declarations
	const cleanText = regexParser.stripText(content);
	const missingFuncs = regexParser.getMissingDeclarations(cleanText);

	const prototypesStr = missingFuncs.join('\n') + '\n'
		+ '#line ' + linesBeforeInjection + ' "' + inputFile + '"\n';
	content = utilities.stringInsert(
		content,
		prototypesIdx,
		prototypesStr
	);

	// Add application.h to the top of the file unless it is already included
	if (appIncludeIdx === -1) {
		const includeStr = '#include "application.h"\n' +
			'#line 1 "' + inputFile + '"\n';

		content = includeStr + content;
	}
	return content;
}

module.exports = {
	processFile
};
