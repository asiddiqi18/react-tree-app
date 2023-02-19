import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { Tree, TreeNode } from "./tree";
import TreeGraph from "./TreeGraph";
import { Divider, Drawer, Fab, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ClearIcon from "@mui/icons-material/Clear";
import ListIcon from "@mui/icons-material/List";
import EditNodeForm, { FormInputs } from "./EditNodeForm";
// custom lines
// shift left or right
// import / export / save data
// export graph as png

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

function cloneTree(tree: Tree): Tree {
  return Object.assign(Object.create(tree), tree);
}

function App() {
  const drawerWidth = 400;

  const [tree, setTree] = useState<Tree>();
  const [selectedNode, setSelectedNode] = useState<TreeNode>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const treeObj = createTreeObj();
    setTree(treeObj);
  }, []);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      setSelectedNode(node);
      handleDrawerOpen();
    },
    [tree]
  );
  
  const handleUpdateSelectedNode = (data: FormInputs) => {
    if (selectedNode && tree) {
      const updatedTree: Tree = cloneTree(tree); // clone tree
      updatedTree.updateNode(selectedNode, {
        value: data.value,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
      });
      setTree(updatedTree);
    }
  };

  const handleAddNode = useCallback(
    (node: TreeNode) => {
      if (tree) {
        const updatedTree: Tree = cloneTree(tree);
        updatedTree.addNode(node, "new");
        setTree(updatedTree);
      }
    },
    [tree]
  );

  const handleInvertNode = useCallback(
    (node: TreeNode) => {
      if (tree) {
        const updatedTree: Tree = cloneTree(tree);
        updatedTree.invertSubtree(node);
        setTree(updatedTree);
      }
    },
    [tree]
  );

  const handleDeleteNode = (node: TreeNode) => {
    if (tree) {
      const updatedTree: Tree = cloneTree(tree); 
      updatedTree.removeNode(node);
      setTree(updatedTree);
      setSelectedNode(undefined);
      handleDrawerClose();
    }
  };

  return (
    <>
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
          variant="persistent"
          anchor="right"
          open={drawerOpen}
        >
          <Toolbar>
            <div className="w-full flex justify-between items-center">
              <h1>Modify Node</h1>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerClose}
                edge="start"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </Toolbar>
          <Divider className="mt-12" />
          <div className="mx-5 my-12">
            {selectedNode && <EditNodeForm
              selectedNode={selectedNode}
              onSubmit={handleUpdateSelectedNode}
              onDelete={handleDeleteNode}
              onInvert={handleInvertNode}
            />}
          </div>
        </Drawer>
        {tree && (
          <TreeGraph
            onNodeClick={handleNodeClick}
            onAddNode={handleAddNode}
            tree={tree}
          />
        )}
      </div>
      <div style={{ position: "fixed", bottom: "16px", left: "16px" }}>
        <div className="flex gap-5">
          <Fab
            color="error"
            onClick={() => tree && handleDeleteNode(tree.root)}
          >
            <ClearIcon />
          </Fab>
          <Fab color="info">
            <ListIcon />
          </Fab>
        </div>
      </div>
    </>
  );
}

export default App;
