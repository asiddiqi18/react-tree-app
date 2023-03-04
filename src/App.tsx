import './App.css';

import { toJpeg, toPng, toSvg } from 'html-to-image';
import { Options } from 'html-to-image/lib/types';
import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Add, Remove, ZoomIn, ZoomOut } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import SettingsIcon from '@mui/icons-material/Settings';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import {
	AppBar,
	Button,
	Divider,
	Drawer,
	Fab,
	IconButton,
	Snackbar,
	Toolbar,
	Typography,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import CustomSnackbar from './CustomSnackbar';
import EditNodeForm from './forms/EditNodeForm';
import { getDataFromLocal, saveDataToLocal } from './localStorage';
import ConfirmDeleteModal from './modals/ConfirmDeleteModal';
import GenerateTreeModal from './modals/GenerateTreeModal';
import TakeScreenshotModal from './modals/TakeScreenshotModal';
import TreeSettingsModal from './modals/TreeSettingsModal';
import DefaultTreeSettings from './resources/default_tree_settings.json';
import EmptyTree from './resources/empty_tree.json';
import { Tree, TreeNode } from './tree';
import TreeGraph from './TreeGraph';
import {
	GenerateRandomTreeSettings,
	LocalData,
	ScreenshotSettings,
	TreeNodeAttributes,
	TreeSettings,
} from './types';

export function createEmptyTree() {
	return Tree.deserialize(EmptyTree)!;
}

function cloneTree(tree: Tree): Tree {
	return Object.assign(Object.create(tree), tree);
}

function App() {
	const drawerWidth = 400;

	const [tree, setTree] = useState<Tree>();
	const [selectedNode, setSelectedNode] = useState<TreeNode>();
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [snackBarOpen, setSnackBarOpen] = useState<boolean>(false);
	const [snackBarMessage, setSnackBarMessage] = useState<string>('');
	const [treeSettingsDialogOpen, setTreeSettingsDialogOpen] =
		useState<boolean>(false);
	const [randomTreeSettingsDialogOpen, setRandomTreeSettingsDialogOpen] =
		useState<boolean>(false);
	const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] =
		useState<boolean>(false);
	const [screenshotDialogOpen, setScreenshotDialogOpen] =
		useState<boolean>(false);
	const [zoom, setZoom] = useState<number>(1);
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
			setTree(createEmptyTree());
		}
		if (treeObj?.treeSettings) {
			setTreeSettings(treeObj?.treeSettings);
		} else {
			setTreeSettings(DefaultTreeSettings);
		}
	}, []);

	const handleScreenshotButtonClick = useCallback(
		(settings: ScreenshotSettings) => {
			if (imageRef.current === null) {
				return;
			}

			const options: Options = { cacheBust: true };

			function createImage(dataUrl: string) {
				const link = document.createElement('a');
				link.download =
					settings.file_name + '.' + settings.format.toLowerCase();
				link.href = dataUrl;
				link.click();
			}

			switch (settings.format) {
			case 'PNG':
				toPng(imageRef.current, options)
					.then((dataUrl) => {
						createImage(dataUrl);
					})
					.catch((err) => {
						console.log(err);
					});
				break;
			case 'JPEG':
				toJpeg(imageRef.current, options)
					.then((dataUrl) => {
						createImage(dataUrl);
					})
					.catch((err) => {
						console.log(err);
					});
				break;
			case 'SVG':
				toSvg(imageRef.current, options)
					.then((dataUrl) => {
						createImage(dataUrl);
					})
					.catch((err) => {
						console.log(err);
					});
				break;
			}
		},
		[imageRef]
	);

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

	const showSnackBar = (message: string) => {
		setSnackBarMessage(message);
		setSnackBarOpen(true);
	};

	return (
		<div
			className='h-screen min-w-max'
			style={{ backgroundColor: treeSettings.backgroundColor }}
		>
			<AppBar
				sx={{ bgcolor: '#739574', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
						Simple Tree Maker
					</Typography>
				</Toolbar>
			</AppBar>
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
				<Toolbar />
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
				<div className='pt-40' ref={imageRef}>
					<div>
						<TreeGraph
							onNodeClick={handleNodeClick}
							onAddNode={handleAddNode}
							tree={tree}
							treeSettings={treeSettings}
							zoom={zoom}
						/>
					</div>
				</div>
			)}
			<TreeSettingsModal
				open={treeSettingsDialogOpen}
				treeSettings={treeSettings}
				handleClose={() => setTreeSettingsDialogOpen(false)}
				handleUpdateTreeSettings={handleUpdateTreeSettings}
			/>
			<GenerateTreeModal
				open={randomTreeSettingsDialogOpen}
				randomTreeSettings={randomTreeSettings}
				handleClose={() => setRandomTreeSettingsDialogOpen(false)}
				handleUpdateRandomTreeSettings={handleUpdateRandomTreeSettings}
			/>
			<ConfirmDeleteModal
				open={confirmDeleteDialogOpen}
				handleClose={() => setConfirmDeleteDialogOpen(false)}
				handleDeleteTree={() => {
					if (tree) {
						const treeObj = createEmptyTree();
						updateTree(treeObj);
					}
					setConfirmDeleteDialogOpen(false);
					setDrawerOpen(false);
				}}
			/>
			<TakeScreenshotModal
				open={screenshotDialogOpen}
				handleClose={() => setScreenshotDialogOpen(false)}
				handleChooseFormat={(data: ScreenshotSettings) => {
					console.log(data);
					handleScreenshotButtonClick(data);
				}}
			/>
			<CustomSnackbar
				open={snackBarOpen}
				message={snackBarMessage}
				onClose={() => setSnackBarOpen(false)}
				type='info'
			/>

			<div className='flex w-full px-4 justify-between fixed bottom-4 left-0 z-20'>
				<div className='flex gap-5'>
					<Tooltip title='Delete'>
						<Fab color='error' onClick={() => setConfirmDeleteDialogOpen(true)}>
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
						<Fab
							color='success'
							onClick={() => {
								setScreenshotDialogOpen(true);
							}}
						>
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
				<div className='flex gap-5'>
					<Tooltip title='Zoom in'>
						<Fab
							color='warning'
							onClick={() => {
								const newZoom = Math.min(zoom + 0.25, 2);
								setZoom(newZoom);
								showSnackBar(`Zoomed in (x${newZoom})`);
							}}
						>
							<Add />
						</Fab>
					</Tooltip>
					<Tooltip
						title='Zoom out'
						onClick={() => {
							const newZoom = Math.max(zoom - 0.25, 0.25);
							setZoom(newZoom);
							showSnackBar(`Zoomed out (x${newZoom})`);
						}}
					>
						<Fab color='warning'>
							<Remove />
						</Fab>
					</Tooltip>
				</div>
			</div>
		</div>
	);
}

export default App;
