const expect = require('chai').expect;
const loadFixtures = require('./__fixtures__');
const preprocessor = require('./index');


describe('Wiring preprocessor', () => {
	const fixtures = loadFixtures();

	fixtures.forEach(fixture => {
		it(`processes fixture: "${fixture.name}"`, () => {
			const { input, output } = fixture;
			const cpp = preprocessor.processFile('/workspace/input.ino', input);
			expect(cpp).to.eql(output);
		});
	});
});
