import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	IconButton,
} from '@mui/material';

import EditRandomTreeForm from '../forms/GenerateRandomTree';
import { GenerateRandomTreeSettings } from '../types';

export default function ConfirmDeleteModal({
	open,
	handleClose,
	handleDeleteTree,
}: {
	open: boolean;
	handleClose: () => void;
	handleDeleteTree: () => void;
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
				Confirm delete
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
				<DialogContentText>
					Are you sure you want to delete this tree?
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>No, take me back</Button>
				<Button onClick={handleDeleteTree} autoFocus>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}
