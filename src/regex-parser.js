/**
 *
 * This library is a basic attempt at identifying wiring-compatible
 * source files, and providing the functions
 * necessary to translate them into firmware compilable C code.
 */

const utilities = require('./utilities');

// identify function declarations
// c language requires functions to be declared before they are used,
// but wiring language do not.

// identify functions
// once we've identified functions without declarations, we can add the
// missing sections

// identify header includes
// we must add any missing header includes, but also keep any user
// supplied headers.

const Parser = {
	functions: {
		declarations(str) {
			// Since these don't handle comments those need to be
			// removed separately.
			const declrRegex = new RegExp('[\\w\\[\\]\\*]+\\s+[&\\[\\]\\*\\w\\s]+\\([&,\\[\\]\\*\\w\\s]*\\)(?=\\s*\\;);', 'gm');
			return Parser.matchAll(declrRegex, str);
		},
		definitions(str) {
			const fnRegex = new RegExp('[\\w\\[\\]\\*]+\\s+[&\\[\\]\\*\\w\\s]+\\([&,\\[\\]\\*\\w\\s]*\\)(?=\\s*\\{)', 'gm');
			return Parser.matchAll(fnRegex, str);
		}
	},

	includes: {
		findAll(str) {
			const fnRegex = new RegExp('#include ((<[^>]+>)|("[^"]+"))', 'gm');
			return Parser.matchAll(fnRegex, str);
		}
	},

	types: {
		declarations(str) {
			const typeRegex = new RegExp(/\b(?!enum class)(class|struct|enum)\b\s+(\w+)/gm);
			return Parser.matchAll(typeRegex, str);
		},
		typedefs(str) {
			const typedefRegex = new RegExp(/\btypedef\s+(struct|enum)\b\s*{[^}]*}\s*(\w+)/gm);
			return Parser.matchAll(typedefRegex, str);
		}
	},

	matchAll(expr, str) {
		let m;
		const matches = [];

		while ((m = expr.exec(str)) !== null) {
			matches.push(m);
		}
		return matches;
	},


	/*
	 * Strip out anything the function definition code doesn't deal with well.
	 * Essentially anything that couldn't possibly contain a function def.
	 */
	stripText(contents) {
		const cruft = new RegExp(
			"('.')" +
				'|("(?:[^"\\\\]|\\\\.)*")' +
				'|(//.[^\n]*)' +
				'|(/\\*[^*]*(?:\\*(?!/)[^*]*)*\\*/)' +
				'|(^\\s*#.*?$)'
			, 'mgi');

		return contents.replace(cruft, '');
	},

	getNoPreprocessor(contents) {
		const re = new RegExp(
			'^[ \t]*#pragma (SPARK_NO_PREPROCESSOR|PARTICLE_NO_PREPROCESSOR)',
			'm'
		);
		const noPreprocessorMatch = contents.match(re);

		if (noPreprocessorMatch) {
			return noPreprocessorMatch.index;
		} else {
			return -1;
		}
	},

	getApplicationInclude(contents) {
		const re = new RegExp(
			'^[ \t]*#include [<"](application.h|Particle.h|Arduino.h)[>"]',
			'm'
		);
		const applicationIncludeMatch = contents.match(re);

		if (applicationIncludeMatch) {
			return applicationIncludeMatch.index;
		} else {
			return -1;
		}
	},

	getMissingDeclarations(contents) {
		// All the ones that don't need extra declarations
		let found = Parser.functions.declarations(contents);
		found = Parser.flattenRegexResults(found);

		// All the user defined types
		const typesDeclarations = Parser.types.declarations(contents);
		const typesTypedef = Parser.types.typedefs(contents);
		const types = [].concat(
			Parser.flattenRegexResults(typesDeclarations, 2),
			Parser.flattenRegexResults(typesTypedef, 2)
		);

		// All the functions we have
		let defined = Parser.functions.definitions(contents);
		defined = Parser.flattenRegexResults(defined);
		defined = Parser.removeSpecialCaseDefinitions(defined);
		defined = Parser.removeDefinitionsWithCustomTypes(defined, types);
		for (let i = 0; i < defined.length; i++) {
			defined[i] = defined[i] + ';';
		}

		// All the ones we're missing
		return utilities.setComplement(defined, found);
	},

	/*
	 * remove things that look like definitions but are not
	 */
	removeSpecialCaseDefinitions: function removeSpecialCaseDefinitions(defined) {
		const wellDefined = [];
		const specialCases = [
			new RegExp(/\belse\b\s+\bif\b/) /* else if(foo) */
		];
		nextDefinition:
		for (let i = 0; i < defined.length; i++) {
			// remove special cases
			for (let j = 0; j < specialCases.length; j++) {
				if (specialCases[j].test(defined[i])) {
					continue nextDefinition;
				}
			}
			wellDefined.push(defined[i]);
		}
		return wellDefined;
	},

	/*
	 * remove definitions with custom classes, structs and enums as parameters
	 */
	removeDefinitionsWithCustomTypes: function removeDefinitionsWithCustomTypes(defined, types) {
		const builtinDefined = [];
		const customTypes = [];
		for (let i = 0; i < types.length; i++) {
			customTypes[i] = new RegExp('\\b' + types[i] + '\\b');
		}
		nextDefinition:
		for (let i = 0; i < defined.length; i++) {
			// remove custom types
			for (let j = 0; j < customTypes.length; j++) {
				if (customTypes[j].test(defined[i])) {
					continue nextDefinition;
				}
			}
			builtinDefined.push(defined[i]);
		}
		return builtinDefined;
	},

	// Return the line number of the first statement in the code
	getFirstStatement: function getFirstStatement(contents) {

		// Find the first thing that isn't these.
		const nonStatement = [
			// Whitespace
			'\\s+',

			// Comments
			'|(/\\*[^*]*(?:\\*(?!/)[^*]*)*\\*/)|(//.*?$)',

			// Include statements
			'|(#include.+$)'
		];

		const pat = new RegExp(nonStatement.join(''), 'mgi');
		let lastMatch = 0;

		let match;
		while ((match = pat.exec(contents)) !== null) {
			if (match.index !== lastMatch) {
				break;
			}
			lastMatch = match[0].length + match.index;
		}

		return lastMatch;
	},

	/*
	 * just the strings please.
	 * @param results
	 * @param group The capture group to return or the entire match
	 */
	flattenRegexResults(results, group) {
		group = group || 0;
		if (results) {
			for (let i = 0; i < results.length; i++) {
				results[i] = results[i][group];
			}
		}
		return results;
	},
};

module.exports = Parser;
