import _ from "lodash";

interface TreeID {
  id: number,
  node: TreeNode,
}

export class TreeNode {
  id: number;
  value: any;
  children: TreeNode[];

  constructor(id: number, value: any, children = []) {
    this.id = id;
    this.value = value;
    this.children = children;
  }

  toString(): string {
    let str = `${this.value}`;
    if (this.children.length > 0) {
      str += ` [${this.children.map(child => child.toString()).join(", ")}]`;
    }
    return str;
  }

}

export class Tree {
  root: TreeNode;
  nodes: TreeID[];
  nextId: number;

  constructor(value: any) {
    this.root = new TreeNode(0, value);
    this.nodes = [{id: 0, node: this.root}];
    this.nextId = 0;
  }

  addNode(parent: TreeNode, value: any): TreeNode {
    const node = new TreeNode(++this.nextId, value);
    parent.children.push(node);
    this.nodes.push({id: this.nextId, node: node});
    return node;
  }

  updateNode(node: TreeNode, newValue: any): void {

    const foundNode = this.nodes.find((it) => it.id === node.id);

    if (foundNode) {
      foundNode.node.value = newValue; 
    }

  }

  listNodes(): TreeID[] {
    return this.nodes;
  }

  BFS(): TreeNode[][] {
    const result: TreeNode[][] = [];
    const queue: TreeNode[] = [this.root];
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

  largestLevelSize(): number {
    const BFS = this.BFS();
    return _.max(BFS.map((lst) => lst.length)) ?? 0
  }

  toString(): string {
    return this.root.toString();
  }

}
