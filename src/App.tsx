import React, { memo, useCallback, useEffect, useState } from "react";
import "./App.css";
import { Tree, TreeNode } from "./tree";
import TreeGraph from "./TreeGraph";
import Button from "@mui/material/Button";
import { Divider, Drawer, IconButton, TextField, Toolbar } from "@mui/material";
import { MuiColorInput, matchIsValidColor } from "mui-color-input";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Email } from "@mui/icons-material";
import { Stack } from "@mui/system";

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

const schema = yup.object().shape({
  value: yup.string().required("value is required"),
});

type FormInputs = {
  value: string;
  color: string;
};

function App() {
  const drawerWidth = 400;

  const [tree, setTree] = useState<Tree>();
  const [selectedNode, setSelectedNode] = useState<TreeNode>();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  console.log(drawerOpen);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    if (selectedNode && tree) {
      const updatedTree: Tree = Object.assign(Object.create(tree), tree); // clone tree
      updatedTree.updateNode(selectedNode, data.value, data.color);
      setTree(updatedTree);
      setSelectedNode({
        ...selectedNode,
        value: data.value,
        color: data.color,
      });
    }
  };

  useEffect(() => {
    const treeObj = createTreeObj();
    setTree(treeObj);
  }, []);

  const handleNodeClick = useCallback(
    (node: TreeNode) => {
      setSelectedNode(node);
      handleDrawerOpen();
      setValue("value", node.value);
      setValue("color", node.color);
    },
    [tree]
  );

  const handleAddNode = useCallback((node: TreeNode) => {
    if (tree) {
      const updatedTree: Tree = Object.assign(Object.create(tree), tree); // clone tree
      updatedTree.addNode(node, "new");
      setTree(updatedTree);
    }
  }, [tree]);

  const handleInvertNode = useCallback((node: TreeNode) => {
    if (tree) {
      const updatedTree: Tree = Object.assign(Object.create(tree), tree); // clone tree
      updatedTree.invertSubtree(node);
      setTree(updatedTree);
    }
  }, [tree]);  

  const handleDeleteNode = (node: TreeNode) => {
    if (tree) {
      const updatedTree: Tree = Object.assign(Object.create(tree), tree); // clone tree
      updatedTree.removeNode(node);
      setTree(updatedTree);
      setSelectedNode(undefined);
      handleDrawerClose();
    }
  }

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <Controller
                name="value"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    className="my-3"
                    error={!!errors.value}
                    helperText={errors.value?.message}
                    fullWidth
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="color"
                control={control}
                defaultValue="#ffffff"
                rules={{ validate: matchIsValidColor }}
                render={({ field, fieldState }) => (
                  <MuiColorInput
                    {...field}
                    label="Background color"
                    className="my-3"
                    isAlphaHidden
                    format="hex"
                    helperText={fieldState.invalid ? "Color is invalid" : ""}
                    error={fieldState.invalid}
                  />
                )}
              />
              <Button variant="contained" color="success" onClick={() => {
                if (selectedNode) {
                  handleInvertNode(selectedNode);
                }
              }} >Invert</Button>
              <Button variant="contained" color="error" onClick={() => {
                if (selectedNode) {
                  handleDeleteNode(selectedNode);
                }
              }} >Delete</Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Stack>
          </form>
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
  );
}

export default App;
