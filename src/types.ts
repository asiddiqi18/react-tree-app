import { Tree } from './tree';

export type TreeSettings = {
	backgroundColor: string;
	levelHeight: number;
	siblingSpace: number;
};

export interface LocalData {
	tree: Tree;
	treeSettings: TreeSettings;
}

export type TreeNodeAttributes = {
	value: string;
	backgroundColor: string;
	textColor: string;
	nodeHeight: number;
	nodeWidth: number;
	lineAttributes: LineAttributes;
};

export type LineAttributes = {
	arrowType: string;
	dashedLine: boolean;
	lineColor: string;
};

export type GenerateRandomTreeSettings = {
	numberOfNodes: number;
};
