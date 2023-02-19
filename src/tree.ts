export class TreeNode {
  id: number;
  value: string;
  color: string;
  children: TreeNode[];

  constructor(id: number, value: string, children = []) {
    this.id = id;
    this.value = value;
    this.color = "#a5d6a7";
    this.children = children;
  }
}

export class Tree {
  root: TreeNode;
  nodes: Map<number, TreeNode>;
  nextId: number;

  constructor(value: any) {
    this.root = new TreeNode(0, value);
    this.nodes = new Map<number, TreeNode>([[0, this.root]]);
    this.nextId = 0;
  }

  addNode(parent: TreeNode, value: any): TreeNode {
    const node = new TreeNode(++this.nextId, value);
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

  removeNode(node: TreeNode): void {
    const parent = this.findParentNode(node);
    if (parent) {
      parent.children = parent.children.filter((child) => child.id !== node.id);
      this.nodes.delete(node.id);
    }
  }

  findNodeById(node: TreeNode): TreeNode | undefined {
    return this.nodes.get(node.id);
  }

  updateNode(node: TreeNode, newValue: any, newColor: any): void {
    const foundNode = this.findNodeById(node);
    if (foundNode) {
      foundNode.value = newValue;
      foundNode.color = newColor;
    }
  }

  invertSubtree(node: TreeNode): void {
    if (node.children.length > 0) {
      node.children.reverse();
      node.children.forEach(child => this.invertSubtree(child));
    }
  }

}
