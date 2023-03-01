import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import EditTreeForm from '../forms/EditTreeForm';
import { TreeSettings } from '../types';

export default function TreeSettingsModal({
	open,
	treeSettings,
	handleClose,
	handleUpdateTreeSettings,
}: {
	open: boolean;
	treeSettings: TreeSettings;
	handleClose: () => void;
	handleUpdateTreeSettings: (data: TreeSettings) => void;
}) {
	return (
		<Dialog
			open={open}
			onClose={(_event, reason) => {
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					handleClose();
				}
			}}
		>
			<DialogTitle>
				Edit Tree Settings{' '}
				<IconButton
					aria-label='close'
					onClick={handleClose}
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
	);
}
