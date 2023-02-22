import _ from 'lodash';

export const defaultBackgroundColor = '#a5d6a7';
export const defaultBackgroundText = '#000000';
export const defaultLineAttributes = {
	showArrow: false,
	dashed: false,
	lineColor: '#000000',
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

export type TreeNodeAttributes = {
	value: string;
	backgroundColor: string;
	textColor: string;
	lineAttributes: LineAttributes;
};

export type LineAttributes = {
	showArrow: boolean;
	dashed: boolean;
	lineColor: string;
};

export class Tree {
	root: TreeNode;
	nodes: Map<number, TreeNode>;
	nextId: number;

	constructor(attributes: TreeNodeAttributes) {
		this.root = new TreeNode(0, attributes);
		this.nodes = new Map<number, TreeNode>([[0, this.root]]);
		this.nextId = 0;
	}

	isMostRecentNode(node: TreeNode): boolean {
		return node.id === this.nextId;
	}

	addNode(parent: TreeNode, value: string): TreeNode {
		const node = new TreeNode(++this.nextId, {
			value: value,
			backgroundColor: defaultBackgroundColor,
			textColor: defaultBackgroundText,
			lineAttributes: defaultLineAttributes,
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
			foundNode.attributes.value = treeMeta.value;
			foundNode.attributes.backgroundColor = treeMeta.backgroundColor;
			foundNode.attributes.textColor = treeMeta.textColor;
			foundNode.attributes.lineAttributes = treeMeta.lineAttributes;
		}
	}

	invertSubtree(node: TreeNode): void {
		if (node.children.length > 0) {
			node.children.reverse();
			node.children.forEach((child) => this.invertSubtree(child));
		}
	}

	serialize(): string {
		const serializedNodes: any[] = [];
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
		return JSON.stringify({ rootId: this.root.id, nodes: serializedNodes });
	}

	static generateRandomTree(N: number): Tree {
		const treeMeta: TreeNodeAttributes = {
			value: 'root',
			backgroundColor: '#a5d6a7',
			textColor: '#000000',
			lineAttributes: {
				showArrow: false,
				dashed: false,
				lineColor: '#000000',
			},
		};

		const tree = new Tree(treeMeta);

		const max_children = 3;

		const queue: TreeNode[] = [tree.root];

		let currentNumberOfNodes = 0;
		while (currentNumberOfNodes < N - 1 && queue.length > 0) {
			const node = queue.shift()!;
			console.log('Current node:', node, 'queue:', queue);
			const numberOfChildren = Math.min(
				N - currentNumberOfNodes,
				1 + Math.floor(Math.random() * max_children)
			);
			console.log('Adding', numberOfChildren, 'children');
			const newChildren: TreeNode[] = [];
			_.times(numberOfChildren, () => {
				const value = Math.floor(Math.random() * 1000).toString();
				console.log('Created', value, 'for', node.attributes.value);
				const newNode = tree.addNode(node, value);
				newChildren.push(newNode);
			});
			queue.push(..._.shuffle(newChildren));

			currentNumberOfNodes += numberOfChildren;
			console.log('------\n');
		}

		return tree;
	}

	// Deserialize a JSON string to a Tree instance
	static deserialize(jsonString: string): Tree {
		const data = JSON.parse(jsonString);
		const nodesMap = new Map<number, TreeNode>();

		console.log(data);

		data.nodes.forEach((serializedNode: { id: any; attributes: any }) => {
			const { id, attributes } = serializedNode;
			const node = new TreeNode(id, attributes);

			nodesMap.set(id, node);
		});

		data.nodes.forEach(
			(serializedNode: { id: any; attributes: any; childrenIds: any }) => {
				const { id, attributes, childrenIds } = serializedNode;
				const children = childrenIds.map((id: number) => nodesMap.get(id)!);

				const node = nodesMap.get(id);
				if (node) {
					node.attributes = attributes;
					node.children = children;
					nodesMap.set(id, node);
				}
			}
		);

		const root = nodesMap.get(0);

		if (root) {
			const tree = new Tree({
				value: root.attributes.value,
				backgroundColor: defaultBackgroundColor,
				textColor: defaultBackgroundText,
				lineAttributes: defaultLineAttributes,
			});
			tree.root = root;
			tree.nodes = nodesMap;
			tree.nextId = data.nodes.length - 1;
			return tree;
		}

		return new Tree({
			value: 'hi',
			backgroundColor: defaultBackgroundColor,
			textColor: defaultBackgroundText,
			lineAttributes: defaultLineAttributes,
		});
	}
}
