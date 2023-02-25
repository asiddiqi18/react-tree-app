import _ from 'lodash';

import RandomWords from './resources/random_words.json';
import { TreeNodeAttributes } from './types';

export const defaultNodeAttributes: TreeNodeAttributes = {
	value: 'new',
	nodeHeight: 96,
	nodeWidth: 96,
	backgroundColor: '#a5d6a7',
	textColor: '#000000',
	lineAttributes: {
		arrowType: 'none',
		dashedLine: false,
		lineColor: '#000000',
	},
};

export type TreeSerialized = {
	rootId: number;
	nodes: TreeNodeSerialized[];
};

export type TreeNodeSerialized = {
	id: number;
	attributes: TreeNodeAttributes;
	childrenIds: number[];
};

export class TreeNode {
	id: number;
	attributes: TreeNodeAttributes;
	children: TreeNode[];

	constructor(id: number, attributes: TreeNodeAttributes, children = []) {
		this.id = id;
		this.children = children;
		this.attributes = attributes;
	}
}

export class Tree {
	root: TreeNode;
	nodes: Map<number, TreeNode>;
	nextId: number;

	constructor(attributes: TreeNodeAttributes) {
		this.root = new TreeNode(0, attributes);
		this.nodes = new Map<number, TreeNode>([[0, this.root]]);
		this.nextId = 0;
	}

	addNode(parent: TreeNode, value: string): TreeNode {
		const node = new TreeNode(++this.nextId, {
			...defaultNodeAttributes,
			value,
		});
		parent.children.push(node);
		this.nodes.set(this.nextId, node);
		return node;
	}

	private findParentNode(node: TreeNode): TreeNode | undefined {
		let parentNode: TreeNode | undefined;
		this.nodes.forEach((currentNode: TreeNode) => {
			if (currentNode.children.includes(node)) {
				parentNode = currentNode;
			}
		});
		return parentNode;
	}

	BFS(node: TreeNode): TreeNode[][] {
		const result: TreeNode[][] = [];
		const queue: TreeNode[] = [node];
		while (queue.length > 0) {
			const levelNodes: TreeNode[] = [];
			const levelSize = queue.length;
			for (let i = 0; i < levelSize; i++) {
				const node = queue.shift()!;
				levelNodes.push(node);
				queue.push(...node.children);
			}
			result.push(levelNodes);
		}
		return result;
	}

	findLevel(node: TreeNode): number | undefined {
		const queue: [TreeNode, number][] = [[this.root, 0]];

		while (queue.length > 0) {
			const [currentNode, level] = queue.shift()!;

			if (currentNode === node) {
				return level;
			}

			for (const child of currentNode.children) {
				queue.push([child, level + 1]);
			}
		}

		return undefined; // Node not found in tree
	}

	removeNode(node: TreeNode): void {
		const parent = this.findParentNode(node);
		if (parent) {
			parent.children = parent.children.filter((child) => child.id !== node.id);
			const levels = this.BFS(node);
			levels.forEach((level) => {
				level.forEach((child) => {
					this.nodes.delete(child.id);
				});
			});
		} else {
			node.children = [];
			this.nodes.clear();
			this.nodes.set(node.id, node);
		}
	}

	shiftLeft(node: TreeNode): void {
		const parent = this.findParentNode(node);
		if (parent) {
			const firstElement = parent.children.shift();
			if (firstElement) parent.children.push(firstElement);
		}
	}

	countSiblings(node: TreeNode): number {
		const parent = this.findParentNode(node);
		return parent?.children.length ?? 0;
	}

	shiftRight(node: TreeNode) {
		const parent = this.findParentNode(node);
		if (parent) {
			const lastElement = parent.children.pop();
			if (lastElement) parent.children.unshift(lastElement);
		}
	}

	findNodeById(node: TreeNode): TreeNode | undefined {
		return this.nodes.get(node.id);
	}

	updateNode(node: TreeNode, treeMeta: TreeNodeAttributes): void {
		const foundNode = this.findNodeById(node);
		if (foundNode) {
			foundNode.attributes = {
				backgroundColor: treeMeta.backgroundColor,
				textColor: treeMeta.textColor,
				value: treeMeta.value,
				nodeHeight: treeMeta.nodeHeight,
				nodeWidth: treeMeta.nodeWidth,
				lineAttributes: {
					dashedLine: treeMeta.lineAttributes.dashedLine,
					arrowType: treeMeta.lineAttributes.arrowType,
					lineColor: treeMeta.lineAttributes.lineColor,
				},
			};
		}
	}

	invertSubtree(node: TreeNode): void {
		if (node.children.length > 0) {
			node.children.reverse();
			node.children.forEach((child) => this.invertSubtree(child));
		}
	}

	static generateRandomTree(N: number): Tree {
		const treeMeta = defaultNodeAttributes;
		const tree = new Tree(treeMeta);

		const max_children = 3;

		const queue: TreeNode[] = [tree.root];

		let currentNumberOfNodes = 0;
		while (currentNumberOfNodes < N - 1 && queue.length > 0) {
			const node = queue.shift()!;
			const numberOfChildren = Math.min(
				N - 1 - currentNumberOfNodes,
				1 + Math.floor(Math.random() * max_children)
			);
			const newChildren: TreeNode[] = [];
			_.times(numberOfChildren, () => {
				const randomIndex = Math.floor(
					Math.random() * RandomWords.words.length
				);
				const randomWord = RandomWords.words[randomIndex];

				const newNode = tree.addNode(node, randomWord);
				newChildren.push(newNode);
			});
			queue.push(..._.shuffle(newChildren));

			currentNumberOfNodes += numberOfChildren;
		}

		return tree;
	}

	serialize(): string {
		const serializedNodes: TreeNodeSerialized[] = [];
		this.nodes.forEach((node) => {
			if (node) {
				const { id, attributes, children } = node;
				serializedNodes.push({
					id,
					attributes,
					childrenIds: children.map((child) => child.id),
				});
			}
		});
		const serializedTree: TreeSerialized = {
			rootId: this.root.id,
			nodes: serializedNodes,
		};
		return JSON.stringify(serializedTree);
	}

	// Deserialize a JSON string to a Tree instance
	static deserialize(tree: TreeSerialized): Tree {
		const data = tree;
		const nodesMap = new Map<number, TreeNode>();

		data.nodes.forEach((serializedNode: TreeNodeSerialized) => {
			const { id, attributes } = serializedNode;
			const node = new TreeNode(id, attributes);

			nodesMap.set(id, node);
		});

		data.nodes.forEach((serializedNode: TreeNodeSerialized) => {
			const { id, attributes, childrenIds } = serializedNode;
			const children = childrenIds.map((id: number) => nodesMap.get(id)!);

			const node = nodesMap.get(id);
			if (node) {
				node.attributes = attributes;
				node.children = children;
				nodesMap.set(id, node);
			}
		});

		const root = nodesMap.get(0);

		if (root) {
			const tree = new Tree(defaultNodeAttributes);
			tree.root = root;
			tree.nodes = nodesMap;
			tree.nextId = data.nodes.length - 1;
			return tree;
		}

		return new Tree(defaultNodeAttributes);
	}
}
