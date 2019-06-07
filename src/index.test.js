const fs = require('fs');
const path = require('path');
const glob = require('glob-promise');
const expect = require('chai').expect;
const preprocessor = require('./index');


describe('Wiring preprocessor', () => {
	// This file must have at least 1 test in addition to the dynamic
	// tests below otherwise Mocha doesn't run any of the tests
	it('loads the processor', () => {
		expect(preprocessor).to.be.ok;
	});

	forEachFixture('__fixtures__', (fixture) => {
		it(`processes ${fixture.name}`, () => {
			return Promise.all([
				readFixture(fixture.directory, 'input.ino'),
				readFixture(fixture.directory, 'output.cpp'),
			]).then((files) => {
				const ino = files[0];
				const cpp = files[1];
				const processedCpp = preprocessor.processFile('/workspace/input.ino', ino);

				expect(processedCpp).to.eql(cpp);
			});
		});
	});

	function forEachFixture(fixtureDirectory, callback) {
		glob(path.join(__dirname, fixtureDirectory, '*', '')).then((fixtures) => {
			return fixtures.map((fixture) => ({
				name: path.basename(fixture).replace(/_/g, ' '),
				directory: fixture,
			}));
		}).then((fixtures) => {
			fixtures.forEach(callback);
		});
	}

	function readFixture(directory, filename) {
		return new Promise((fulfill, reject) => {
			fs.readFile(path.join(directory, filename), 'utf8', (err, content) => {
				if (err) {
					reject(err);
				}
				fulfill(content);
			});
		});
	}
});
