import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
	defaultBackgroundColor,
	defaultBackgroundText,
	defaultLineAttributes,
	Tree,
	TreeNode,
} from './tree';
import TreeGraph from './TreeGraph';
import { Divider, Drawer, Fab, IconButton, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ClearIcon from '@mui/icons-material/Clear';
import ListIcon from '@mui/icons-material/List';
import EditNodeForm, { FormInputs } from './EditNodeForm';
// export graph as png

interface MyData {
	tree: Tree;
}

function createTreeObj() {
	const tree = new Tree({
		value: 'root',
		backgroundColor: defaultBackgroundColor,
		textColor: defaultBackgroundText,
		lineAttributes: defaultLineAttributes,
	});

	const node1 = tree.addNode(tree.root, 'A');
	const node2 = tree.addNode(tree.root, 'B');
	const node3 = tree.addNode(node1, 'C');
	const node4 = tree.addNode(node1, 'D');
	const node5 = tree.addNode(node1, 'E');
	const node6 = tree.addNode(node5, 'F');
	const node8 = tree.addNode(node2, 'H');
	const node7 = tree.addNode(node2, 'G');
	const node9 = tree.addNode(node7, 'I');
	const node10 = tree.addNode(node7, 'J');
	const node11 = tree.addNode(node7, 'K');
	const node12 = tree.addNode(node7, 'L');
	const node13 = tree.addNode(node11, 'M');
	const node14 = tree.addNode(node11, 'N');
	const node15 = tree.addNode(node2, 'O');

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

	const saveDataToLocal = (data: MyData) => {
		if (tree) {
			localStorage.setItem('myData', tree.serialize());
		}
	};

	const getDataFromLocal = (): MyData | null => {
		const data = localStorage.getItem('myData');
		console.log(data);
		if (data) {
			return { tree: Tree.deserialize(data) };
		}
		return null;
	};

	useEffect(() => {
		// setTree(createTreeObj());
		const treeObj = getDataFromLocal();
		if (treeObj) {
			const tree1: Tree = treeObj.tree;
			const importedTree = cloneTree(tree1);
			setTree(importedTree);
		} else {
			setTree(createTreeObj());
		}
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

	const saveTree = () => {
		if (tree) {
			const myData: MyData = { tree };
			saveDataToLocal(myData);
		} else {
			console.log('tree is undefined');
		}
	};

	useEffect(() => {
		console.log(selectedNode);
	}, [selectedNode]);

	const handleUpdateSelectedNode = (data: FormInputs) => {
		console.log(data);
		if (selectedNode && tree) {
			const updatedTree: Tree = cloneTree(tree); // clone tree
			updatedTree.updateNode(selectedNode, {
				value: data.value,
				backgroundColor: data.backgroundColor,
				textColor: data.textColor,
				lineAttributes: {
					showArrow: data.arrowedLine,
					dashed: data.dashedLine,
					lineColor: data.lineColor,
				},
			});
			setTree(updatedTree);
			saveTree();
		}
	};

	const handleAddNode = useCallback(
		(node: TreeNode) => {
			if (tree) {
				const updatedTree: Tree = cloneTree(tree);
				updatedTree.addNode(node, 'new');
				setTree(updatedTree);
				saveTree();
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
				saveTree();
			}
		},
		[tree]
	);

	const handleDeleteNode = (node: TreeNode) => {
		if (tree) {
			const updatedTree: Tree = cloneTree(tree);
			updatedTree.removeNode(node);
			setTree(updatedTree);
			saveTree();
			setSelectedNode(undefined);
			handleDrawerClose();
		}
	};

	const handleShift = (node: TreeNode, direction: 'left' | 'right') => {
		if (tree) {
			const updatedTree: Tree = cloneTree(tree);
			if (direction === 'left') {
				updatedTree.shiftLeft(node);
			} else if (direction === 'right') {
				updatedTree.shiftRight(node);
			}
			setTree(updatedTree);
			saveTree();
		}
	};

	return (
		<>
			<div className='m-40'>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
						},
					}}
					variant='persistent'
					anchor='right'
					open={drawerOpen}
				>
					<Toolbar>
						<div className='w-full flex justify-between items-center'>
							<h1>Modify Node &apos;{selectedNode?.attributes.value}&apos;</h1>
							<IconButton
								color='inherit'
								aria-label='open drawer'
								onClick={handleDrawerClose}
								edge='start'
							>
								<CloseIcon />
							</IconButton>
						</div>
					</Toolbar>
					<Divider className='mt-12' />
					<div className='mx-5 my-12'>
						{selectedNode && (
							<EditNodeForm
								selectedNode={selectedNode}
								onSubmit={handleUpdateSelectedNode}
								onDelete={handleDeleteNode}
								onInvert={handleInvertNode}
								onShift={handleShift}
							/>
						)}
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
			<div style={{ position: 'fixed', bottom: '16px', left: '16px' }}>
				<div className='flex gap-5'>
					<Fab
						color='error'
						onClick={() => {
							if (tree) {
								handleDeleteNode(tree.root);
								saveTree();
							}
						}}
					>
						<ClearIcon />
					</Fab>
					<Fab
						color='info'
						onClick={() => {
							// setTree(createTreeObj())
							// saveTree();
							console.log(tree?.nodes);
						}}
					>
						<ListIcon />
					</Fab>
				</div>
			</div>
		</>
	);
}

export default App;
