const regexParser = require('./regex-parser');
const utilities = require('./utilities');
const banner = [
	'/******************************************************/',
	'//       THIS IS A GENERATED FILE - DO NOT EDIT       //',
	'/******************************************************/',
	''
];


module.exports.processFile = (inputFile, content) => {
	// Skip files with PARTICLE_NO_PREPROCESSOR
	const noPreprocessorIdx = regexParser.getNoPreprocessor(content);

	if (noPreprocessorIdx >= 0){
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
	if (appIncludeIdx > prototypesIdx){
		prototypesIdx = content.indexOf('\n', appIncludeIdx) + 1;
	}

	// Add a #line preprocessor instruction to sync the errors with the original code
	const linesBeforeInjection = content.substring(0, prototypesIdx).split('\n').length;

	// Add function declarations
	const cleanText = regexParser.stripText(content);
	const missingFuncs = regexParser.getMissingDeclarations(cleanText);

	content = utilities.stringInsert(
		content,
		prototypesIdx,
		[
			...missingFuncs,
			`#line ${linesBeforeInjection} "${inputFile}"`,
			''
		].join('\n')
	);

	// Add default line directive, add application.h if missing
	const directives = [`#line 1 "${inputFile}"`];

	if (appIncludeIdx === -1){
		directives.unshift('#include "Particle.h"');
	}

	content = utilities.stringInsertLines(content, 0, directives.join('\n'));

	// add banner
	return utilities.stringInsertLines(content, 0, banner.join('\n'));
};

