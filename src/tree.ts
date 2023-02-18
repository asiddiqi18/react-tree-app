import _ from "lodash";

export class TreeNode {
  value: any;
  children: TreeNode[];

  constructor(value: any, children = []) {
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

  constructor(value: any) {
    this.root = new TreeNode(value);
  }

  addNode(parent: TreeNode, value: any): TreeNode {
    const node = new TreeNode(value);
    parent.children.push(node);
    return node;
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
