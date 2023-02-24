import { Tree } from './tree';
import { LocalData } from './types';

export const saveDataToLocal = (data: LocalData) => {
	if (data.tree && data.treeSettings) {
		const saved = `{"tree": ${data.tree.serialize()}, "treeSettings": ${JSON.stringify(
			data.treeSettings
		)}}`;

		localStorage.setItem('myData', saved);
	}
};

export const getDataFromLocal = (): LocalData | null => {
	const data = localStorage.getItem('myData');
	if (data) {
		const parsed = JSON.parse(data);
		let treeSettingsParsed;
		if (parsed.treeSettings) {
			treeSettingsParsed = parsed.treeSettings;
		}
		return {
			tree: Tree.deserialize(parsed.tree),
			treeSettings: treeSettingsParsed,
		};
	}
	return null;
};
