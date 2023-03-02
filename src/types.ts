import { Tree } from './tree';

export type TreeSerialized = {
	rootId: number;
	nodes: TreeNodeSerialized[];
};

export type TreeNodeSerialized = {
	id: number;
	attributes: TreeNodeAttributes;
	childrenIds: number[];
};

export type TreeSettings = {
	backgroundColor: string;
	levelHeight: number;
	siblingSpace: number;
};

export type LineAttributes = {
	arrowType: string;
	dashedLine: boolean;
	lineColor: string;
};

export type TreeNodeAttributes = {
	value: string;
	backgroundColor: string;
	textColor: string;
	nodeHeight: number;
	nodeWidth: number;
	lineAttributes: LineAttributes;
};

export interface LocalData {
	tree: Tree;
	treeSettings: TreeSettings;
}

export type GenerateRandomTreeSettings = {
	numberOfNodes: number;
};

export type ScreenshotSettings = {
	format: string;
	file_name: string;
};
