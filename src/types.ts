import { Tree } from './tree';

export type EditTreeFormInputs = {
	backgroundColor: string;
	nodeResize: boolean;
	levelHeight: number;
	siblingSpace: number;
};

export type EditNodeFormInputs = {
	value: string;
	backgroundColor: string;
	textColor: string;
	lineColor: string;
	dashedLine: boolean;
	arrowedLine: boolean;
};

export interface LocalData {
	tree: Tree;
	treeSettings: EditTreeFormInputs;
}
