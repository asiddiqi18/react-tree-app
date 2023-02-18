
export class TreeNode {
  id: number;
  value: any;
  children: TreeNode[];

  constructor(id: number, value: any, children = []) {
    this.id = id;
    this.value = value;
    this.children = children;
  }

}

export class Tree {
  root: TreeNode;
  nodes: Map<number, TreeNode>;
  nextId: number;

  constructor(value: any) {
    this.root = new TreeNode(0, value);
    this.nodes = new Map<number, TreeNode>([
      [0, this.root]
    ]);
    this.nextId = 0;
  }

  addNode(parent: TreeNode, value: any): TreeNode {
    const node = new TreeNode(++this.nextId, value);
    parent.children.push(node);
    this.nodes.set(this.nextId, node);
    return node;
  }

  findNodeById(node: TreeNode): TreeNode | undefined {
    return this.nodes.get(node.id);
  }

  updateNode(node: TreeNode, newValue: any): void {

    const foundNode = this.findNodeById(node);

    if (foundNode) {
      foundNode.value = newValue; 
    }

  }

}
