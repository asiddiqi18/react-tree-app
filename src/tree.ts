export class TreeNode {
  id: number;
  value: string;
  backgroundColor: string;
  textColor: string;
  children: TreeNode[];

  constructor(id: number, value: string, children = []) {
    this.id = id;
    this.value = value;
    this.backgroundColor = "#a5d6a7";
    this.textColor = "#000000";
    this.children = children;
  }
}

export type TreeMeta = {
  value: string,
  backgroundColor: string,
  textColor: string,
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

  isMostRecentNode(node: TreeNode): boolean {
    return node.id === this.nextId;
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
        })
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

  updateNode(node: TreeNode, treeMeta: TreeMeta): void {
    const foundNode = this.findNodeById(node);
    if (foundNode) {
      foundNode.value = treeMeta.value;
      foundNode.backgroundColor = treeMeta.backgroundColor;
      foundNode.textColor = treeMeta.textColor;
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
        const { id, value, backgroundColor, textColor, children } = node;
        serializedNodes.push({ id, value, backgroundColor, textColor, childrenIds: children.map((child) => child.id) });
      }
    });
    return JSON.stringify({ rootId: this.root.id, nodes: serializedNodes });
  }

    // Deserialize a JSON string to a Tree instance
    static deserialize(jsonString: string): Tree {
      const data = JSON.parse(jsonString);
      const nodesMap = new Map<number, TreeNode>();

      data.nodes.forEach((serializedNode: { id: any; value: any; backgroundColor: any; textColor: any; childrenIds: any; }) => {
        const { id, value, backgroundColor, textColor } = serializedNode;
        const node = new TreeNode(id, value);
        node.backgroundColor = backgroundColor;
        node.textColor = textColor;
        
        nodesMap.set(id, node);
      });

      data.nodes.forEach((serializedNode: { id: any; value: any; backgroundColor: any; textColor: any; childrenIds: any; }) => {
        const { id, value, childrenIds } = serializedNode;
        const children = childrenIds.map((id: number) => nodesMap.get(id)!);

        const node = nodesMap.get(id);
        if (node) {
          node.children = children;
          nodesMap.set(id, node);
        }      
      
      });

      const root = nodesMap.get(0);

      if (root) {
        const tree = new Tree(root.value);
        tree.root = root;
        tree.nodes = nodesMap;
        tree.nextId = data.nodes.length - 1;
        return tree;
      }

      return new Tree('hi');

    }
  }

