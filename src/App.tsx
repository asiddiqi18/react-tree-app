import './App.css';

import { toSvg } from 'html-to-image';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Divider, Drawer, Fab, IconButton, Toolbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tooltip from '@mui/material/Tooltip';

import EditNodeForm from './forms/EditNodeForm';
import EditTreeForm from './forms/EditTreeForm';
import { getDataFromLocal, saveDataToLocal } from './localSotrage';
import EmptyTree from './resources/empty_tree.json';
import { Tree, TreeNode } from './tree';
import TreeGraph from './TreeGraph';
import { LocalData, TreeNodeAttributes, TreeSettings } from './types';

function createTreeObj() {
	return Tree.deserialize(EmptyTree);
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
	const [treeSettings, setTreeSettings] = useState<TreeSettings>();
	const imageRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const treeObj = getDataFromLocal();

		if (treeObj?.tree) {
			const tree1: Tree = treeObj.tree;
			const importedTree = cloneTree(tree1);
			setTree(importedTree);
		} else {
			setTree(createTreeObj());
		}
		if (treeObj?.treeSettings) {
			setTreeSettings(treeObj?.treeSettings);
		} else {
			setTreeSettings({
				backgroundColor: '#ffffff',
				levelHeight: 48,
				siblingSpace: 5,
			});
		}
	}, []);

	const handleScreenshotButtonClick = useCallback(() => {
		if (imageRef.current === null) {
			return;
		}

		toSvg(imageRef.current, { cacheBust: true, height: 1000 })
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = 'my-tree.svg';
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => {
				console.log(err);
			});
	}, [imageRef]);

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
		if (newTree && treeSettings) {
			setTree(newTree);
			console.log('Saved new tree.', newTree);
			const myData: LocalData = { tree: newTree, treeSettings };
			_.debounce(() => {
				saveDataToLocal(myData);
			}, 500)();
		}
	};

	const handleUpdateSelectedNode = (data: TreeNodeAttributes) => {
		if (selectedNode && tree) {
			const updatedTree: Tree = cloneTree(tree); // clone tree
			updatedTree.updateNode(selectedNode, data);
			console.log('Updating selected node.', data);
			updateTree(updatedTree);
		}
	};

	const handleUpdateTreeSettings = (data: TreeSettings) => {
		setTreeSettings({ ...data });
		setDialogOpen(false);
		if (tree && treeSettings) {
			saveDataToLocal({ tree, treeSettings: data });
		}
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

	const generateRandomTreeFunc = async () => {
		return await Tree.generateRandomTree(16);
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

			<Dialog open={dialogOpen}>
				<DialogTitle>
					Edit Tree Settings{' '}
					<IconButton
						aria-label='close'
						onClick={() => setDialogOpen(false)}
						sx={{
							position: 'absolute',
							right: 8,
							top: 8,
						}}
					>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
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
									const treeObj = createTreeObj();
									updateTree(treeObj);
								}
							}}
						>
							<ClearIcon />
						</Fab>
					</Tooltip>
					<Tooltip title='Randomize'>
						<Fab
							color='info'
							onClick={async () => {
								const treeObj = await generateRandomTreeFunc();
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
