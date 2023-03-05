import { Tree } from './tree';
import { LocalData } from './types';

const KEY_NAME = 'AppData';

export const saveDataToLocal = (data: LocalData) => {
	if (data.tree && data.treeSettings) {
		const saved = `{"tree": ${data.tree.serialize()}, "treeSettings": ${JSON.stringify(
			data.treeSettings
		)}}`;

		localStorage.setItem(KEY_NAME, saved);
	}
};

export const getDataFromLocal = (): LocalData | null => {
	const data = localStorage.getItem(KEY_NAME);
	if (data) {
		const parsed = JSON.parse(data);
		let treeSettingsParsed;
		if (parsed.treeSettings) {
			treeSettingsParsed = parsed.treeSettings;
		}
		const tree = Tree.deserialize(parsed.tree);

		if (!tree) {
			return null;
		}

		return {
			tree: tree,
			treeSettings: treeSettingsParsed,
		};
	}
	return null;
};
