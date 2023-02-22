import './App.css';

import { toSvg } from 'html-to-image';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
	Button,
	Divider,
	Drawer,
	Fab,
	IconButton,
	TextField,
	Toolbar,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

import EditNodeForm, { EditNodeFormInputs } from './EditNodeForm';
import EditTreeForm, { EditTreeFormInputs } from './EditTreeForm';
import { Tree, TreeNode } from './tree';
import TreeGraph from './TreeGraph';

interface MyData {
	tree: Tree;
}

function createTreeObj() {
	const data = {
		rootId: 0,
		nodes: [
			{
				id: 0,
				attributes: {
					value: 'root',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [1, 2],
			},
			{
				id: 1,
				attributes: {
					value: 'new',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [],
			},
			{
				id: 2,
				attributes: {
					value: 'new',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [3, 4, 5],
			},
			{
				id: 3,
				attributes: {
					value: 'new',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [],
			},
			{
				id: 4,
				attributes: {
					value: 'new',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [],
			},
			{
				id: 5,
				attributes: {
					value: 'new',
					backgroundColor: '#a5d6a7',
					textColor: '#000000',
					lineAttributes: {
						showArrow: false,
						dashed: false,
						lineColor: '#000000',
					},
				},
				childrenIds: [],
			},
		],
	};

	return Tree.deserialize(JSON.stringify(data));
}

function cloneTree(tree: Tree): Tree {
	return Object.assign(Object.create(tree), tree);
}

function App() {
	const drawerWidth = 400;

	const [tree, setTree] = useState<Tree>();
	const [selectedNode, setSelectedNode] = useState<TreeNode>();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);
	const [treeSettings, setTreeSettings] = useState<EditTreeFormInputs>();
	const imageRef = useRef<HTMLDivElement>(null);

	const handleScreenshotButtonClick = useCallback(() => {
		if (imageRef.current === null) {
			return;
		}

		toSvg(imageRef.current, { cacheBust: true, height: 1000 })
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = 'my-image-name.svg';
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.log(err);
			});
	}, [imageRef]);

	const saveDataToLocal = (data: MyData) => {
		if (tree) {
			localStorage.setItem('myData', data.tree.serialize());
		}
	};

	const getDataFromLocal = (): MyData | null => {
		const data = localStorage.getItem('myData');
		if (data) {
			return { tree: Tree.deserialize(data) };
		}
		return null;
	};

	useEffect(() => {
		const treeObj = getDataFromLocal();
		if (treeObj) {
			const tree1: Tree = treeObj.tree;
			const importedTree = cloneTree(tree1);
			setTree(importedTree);
		} else {
			setTree(createTreeObj());
		}
		setTreeSettings({
			backgroundColor: '#ffffff',
			levelHeight: 48,
			nodeResize: false,
		});
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

	const updateTree = (newTree: Tree) => {
		if (newTree) {
			setTree(newTree);
			const myData: MyData = { tree: newTree };
			_.debounce(() => {
				saveDataToLocal(myData);
			}, 500)();
		}
	};

	const handleUpdateSelectedNode = (data: EditNodeFormInputs) => {
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
			updateTree(updatedTree);
		}
	};

	const handleUpdateTreeSettings = (data: EditTreeFormInputs) => {
		console.log(data);
		setTreeSettings({ ...data });
		setDialogOpen(false);
	};

	const handleAddNode = useCallback(
		(node: TreeNode) => {
			if (tree) {
				const updatedTree: Tree = cloneTree(tree);
				updatedTree.addNode(node, 'new');
				updateTree(updatedTree);
			}
		},
		[tree]
	);

	const handleInvertNode = useCallback(
		(node: TreeNode) => {
			if (tree) {
				const updatedTree: Tree = cloneTree(tree);
				updatedTree.invertSubtree(node);
				updateTree(updatedTree);
			}
		},
		[tree]
	);

	const handleDeleteNode = (node: TreeNode) => {
		if (tree) {
			const updatedTree: Tree = cloneTree(tree);
			updatedTree.removeNode(node);
			updateTree(updatedTree);
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
			updateTree(updatedTree);
		}
	};

	return (
		<div>
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
						<h1 className='text-lg'>
							Modify Node &apos;{selectedNode?.attributes.value}&apos;
						</h1>
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
				<Divider />
				<div className='my-4'>
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
			{tree && treeSettings && (
				<div className='mt-40' ref={imageRef}>
					<TreeGraph
						onNodeClick={handleNodeClick}
						onAddNode={handleAddNode}
						tree={tree}
						treeSettings={treeSettings}
					/>
				</div>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>Edit Tree Settings</DialogTitle>
				<DialogContent>
					{treeSettings && (
						<EditTreeForm
							treeSettings={treeSettings}
							onSubmit={handleUpdateTreeSettings}
						/>
					)}
				</DialogContent>
			</Dialog>

			<div style={{ position: 'fixed', bottom: '16px', left: '16px' }}>
				<div className='flex gap-5'>
					<Tooltip title='Delete'>
						<Fab
							color='error'
							onClick={() => {
								if (tree) {
									handleDeleteNode(tree.root);
								}
							}}
						>
							<ClearIcon />
						</Fab>
					</Tooltip>
					<Tooltip title='Randomize'>
						<Fab
							color='info'
							onClick={() => {
								const treeObj = Tree.generateRandomTree(16);
								updateTree(treeObj);
							}}
						>
							<ShuffleIcon />
						</Fab>
					</Tooltip>
					<Tooltip title='Screenshot'>
						<Fab color='success' onClick={handleScreenshotButtonClick}>
							<PhotoCameraIcon />
						</Fab>
					</Tooltip>
					<Tooltip title='Settings'>
						<Fab color='secondary' onClick={() => setDialogOpen(true)}>
							<SettingsIcon />
						</Fab>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}

export default App;
