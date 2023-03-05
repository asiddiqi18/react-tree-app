import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';

import TakeScreenshotForm from '../forms/TakeScreenshotForm';
import { ScreenshotSettings } from '../types';

export default function TakeScreenshotModal({
	open,
	handleClose,
	handleChooseFormat,
}: {
	open: boolean;
	handleClose: () => void;
	handleChooseFormat: (data: ScreenshotSettings) => void;
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
				Export tree
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
			<DialogContent className='max-w-md'>
				<TakeScreenshotForm onSubmit={handleChooseFormat} />
			</DialogContent>
		</Dialog>
	);
}
