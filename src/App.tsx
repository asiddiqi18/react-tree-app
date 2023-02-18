import React, { useEffect, useState } from "react";
import "./App.css";
import { Tree, TreeNode } from "./tree";
import TreeGraph from "./TreeGraph";
import Button from "@mui/material/Button";
import {
  Drawer,
  TextField,
} from "@mui/material";

function createTreeObj() {
  const tree = new Tree("root");
  // const node1 = tree.addNode(tree.root, "child1");
  // const node2 = tree.addNode(tree.root, "child2");
  // const node3 = tree.addNode(node1, "grandchild1.1");
  // const node4 = tree.addNode(node1, "grandchild1.2");
  // const node5 = tree.addNode(node1, "grandchild1.3");
  // const node6 = tree.addNode(node5, "great-grandchild1.3.1");
  // const node7 = tree.addNode(node2, "grandchild2.1");
  // const node8 = tree.addNode(node2, "grandchild2.2");
  // const node9 = tree.addNode(node7, "great-grandchild2.2.1");
  // const node10 = tree.addNode(node7, "great-grandchild2.2.2");
  // const node11 = tree.addNode(node7, "great-grandchild2.2.3");
  // const node12 = tree.addNode(node7, "great-grandchild2.2.4");
  // const node13 = tree.addNode(node11, "great-great-grandchild2.2.4.1");
  // const node14 = tree.addNode(node11, "great-great-grandchild2.2.4.2");
  // const node15 = tree.addNode(node2, "grandchild2.3");

  const node1 = tree.addNode(tree.root, "A");
  const node2 = tree.addNode(tree.root, "B");
  const node3 = tree.addNode(node1, "C");
  const node4 = tree.addNode(node1, "D");
  const node5 = tree.addNode(node1, "E");
  const node6 = tree.addNode(node5, "F");
  const node8 = tree.addNode(node2, "H");
  const node7 = tree.addNode(node2, "G");
  const node9 = tree.addNode(node7, "I");
  const node10 = tree.addNode(node7, "J");
  const node11 = tree.addNode(node7, "K");
  const node12 = tree.addNode(node7, "L");
  const node13 = tree.addNode(node11, "M");
  const node14 = tree.addNode(node11, "N");
  const node15 = tree.addNode(node2, "O");

  return tree;
}

function App() {
  const drawerWidth = 400;

  const [tree, setTree] = useState<Tree>();
  const [selectedNode, setSelectedNode] = useState<TreeNode>();

  useEffect(() => {
    const treeObj = createTreeObj();
    setTree(treeObj);
  }, []);

  const handleNodeClick = (node: TreeNode) => {
    console.log(tree?.listNodes());
    setSelectedNode(node);
  };

  const handleNodeChange = (newValue: string) => {
    if (selectedNode && tree) {
      const updatedTree: Tree = Object.assign(Object.create(tree), tree); // clone tree
      updatedTree.updateNode(selectedNode, newValue);
      setTree(updatedTree);
      setSelectedNode({ ...selectedNode, value: newValue });
    }
  };

  return (
    <div className="m-40">
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="right"
      >
        <div className="mx-5 my-12">
          <TextField
            key="idk"
            id="outlined-multiline-flexible"
            label="Node Name"
            value={selectedNode?.value}
            onChange={(event) => {
              if (selectedNode) {
                handleNodeChange(event.target.value);
              }
            }}
            className="w-full"
            multiline
            maxRows={4}
          />
        </div>
      </Drawer>

      <Button variant="contained">Hello World</Button>
      {tree && <TreeGraph onNodeClick={handleNodeClick} tree={tree} />}
    </div>
  );
}

export default App;
