import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import EditRandomTreeForm from '../forms/GenerateRandomTree';
import { GenerateRandomTreeSettings } from '../types';

export default function GenerateTreeModal({
	open,
	randomTreeSettings,
	handleClose,
	handleUpdateRandomTreeSettings,
}: {
	open: boolean;
	randomTreeSettings: GenerateRandomTreeSettings;
	handleClose: () => void;
	handleUpdateRandomTreeSettings: (data: GenerateRandomTreeSettings) => void;
}) {
	return (
		<Dialog
			fullWidth={true}
			maxWidth={'xs'}
			open={open}
			onClose={(_event, reason) => {
				if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
					handleClose();
				}
			}}
		>
			<DialogTitle sx={{ m: 0, p: 2 }}>
				Generate Random Tree
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
				{randomTreeSettings && (
					<EditRandomTreeForm
						randomTreeSettings={randomTreeSettings}
						onSubmit={handleUpdateRandomTreeSettings}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}
