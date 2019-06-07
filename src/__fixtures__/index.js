const fs = require('fs');
const path = require('path');
const glob = require('glob');


module.exports = () => {
	const pattern = path.join(__dirname, '*', '/');
	const directories = glob.sync(pattern);
	const files = directories.map(dir => [
		fs.readFileSync(path.join(dir, 'input.ino'), 'utf8'),
		fs.readFileSync(path.join(dir, 'output.cpp'), 'utf8')
	]);

	return directories.map((dir, index) => ({
		name: path.basename(dir),
		directory: dir,
		input: files[index][0],
		output: files[index][1]
	}));
};
