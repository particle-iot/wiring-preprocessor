module.exports = {
	stringInsert(str, idx, val){
		return str.substring(0, idx) + val + str.substring(idx);
	},

	stringInsertLines(str, idx, val){
		const lines = str.split(/\r?\n/);
		lines.splice(idx, 0, val);
		return lines.join('\n');
	},

	/*
	 * Give the set of items in required that aren't in found
	 * @param required
	 * @param found
	 */
	setComplement(required, found){
		const hash = {};
		for (let i = 0; i < found.length; i++){
			hash[found[i]] = true;
		}

		const results = [];
		for (let i = 0; i < required.length; i++){
			const item = required[i];
			if (hash[item]){
				continue;
			}
			results.push(item);
		}
		return results;
	},
};
