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
import EditRandomTreeForm from './forms/GenerateRandomTree';
import { getDataFromLocal, saveDataToLocal } from './localStorage';
import DefaultTreeSettings from './resources/default_tree_settings.json';
import EmptyTree from './resources/empty_tree.json';
import { Tree, TreeNode } from './tree';
import TreeGraph from './TreeGraph';
import {
	GenerateRandomTreeSettings,
	LocalData,
	TreeNodeAttributes,
	TreeSettings,
} from './types';

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
	const [treeSettingsDialogOpen, setTreeSettingsDialogOpen] =
		useState<boolean>(false);
	const [randomTreeSettingsDialogOpen, setRandomTreeSettingsDialogOpen] =
		useState<boolean>(false);
	const [treeSettings, setTreeSettings] = useState<TreeSettings>();
	const [randomTreeSettings, setRandomTreeSettings] =
		useState<GenerateRandomTreeSettings>({ numberOfNodes: 16 });
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
			setTreeSettings(DefaultTreeSettings);
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
		if (newTree && tree && treeSettings) {
			setTree(newTree);
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
			updateTree(updatedTree);
		}
	};

	const handleUpdateTreeSettings = (data: TreeSettings) => {
		setTreeSettings({ ...data });
		setTreeSettingsDialogOpen(false);
		if (!tree) {
			return;
		}
		saveDataToLocal({ tree, treeSettings: data });
	};

	const handleUpdateRandomTreeSettings = (data: GenerateRandomTreeSettings) => {
		setRandomTreeSettings({ ...data });
		setRandomTreeSettingsDialogOpen(false);

		const treeObj = Tree.generateRandomTree(data.numberOfNodes);
		updateTree(treeObj);
	};

	const handleAddNode = useCallback(
		(node: TreeNode) => {
			if (!tree) {
				return;
			}
			const updatedTree: Tree = cloneTree(tree);
			updatedTree.addNode(node, 'new');
			updateTree(updatedTree);
		},
		[tree]
	);

	const handleInvertNode = useCallback(
		(node: TreeNode) => {
			if (!tree) {
				return;
			}
			const updatedTree: Tree = cloneTree(tree);
			updatedTree.invertSubtree(node);
			updateTree(updatedTree);
		},
		[tree]
	);

	const handleDeleteNode = (node: TreeNode) => {
		if (!tree) {
			return;
		}
		const updatedTree: Tree = cloneTree(tree);
		updatedTree.removeNode(node);
		updateTree(updatedTree);
		setSelectedNode(undefined);
		handleDrawerClose();
	};

	const handleShift = (node: TreeNode, direction: 'left' | 'right') => {
		if (!tree) {
			return;
		}
		const updatedTree: Tree = cloneTree(tree);
		if (direction === 'left') {
			updatedTree.shiftLeft(node);
		} else if (direction === 'right') {
			updatedTree.shiftRight(node);
		}
		updateTree(updatedTree);
	};

	if (!tree || !treeSettings) {
		return <></>;
	}

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
						<h1 className='text-lg truncate mr-3'>
							Modify Node - {selectedNode?.attributes.value}
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
						<div>
							<EditNodeForm
								selectedNode={selectedNode}
								onSubmit={handleUpdateSelectedNode}
								onDelete={handleDeleteNode}
								onInvert={handleInvertNode}
								onShift={handleShift}
							/>
						</div>
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

			<Dialog open={treeSettingsDialogOpen}>
				<DialogTitle>
					Edit Tree Settings{' '}
					<IconButton
						aria-label='close'
						onClick={() => setTreeSettingsDialogOpen(false)}
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
					<EditTreeForm
						treeSettings={treeSettings}
						onSubmit={handleUpdateTreeSettings}
					/>
				</DialogContent>
			</Dialog>

			<Dialog
				open={randomTreeSettingsDialogOpen}
				onClose={(event, reason) => {
					if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
						setRandomTreeSettingsDialogOpen(false);
					}
				}}
			>
				<DialogTitle>
					Generate Random Tree{' '}
					<IconButton
						aria-label='close'
						onClick={() => setRandomTreeSettingsDialogOpen(false)}
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
					{randomTreeSettings && (
						<EditRandomTreeForm
							randomTreeSettings={randomTreeSettings}
							onSubmit={handleUpdateRandomTreeSettings}
						/>
					)}
				</DialogContent>
			</Dialog>

			<div
				style={{
					position: 'fixed',
					bottom: '16px',
					left: '16px',
					zIndex: '20',
				}}
			>
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
							onClick={() => setRandomTreeSettingsDialogOpen(true)}
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
						<Fab
							color='secondary'
							onClick={() => setTreeSettingsDialogOpen(true)}
						>
							<SettingsIcon />
						</Fab>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}

export default App;
