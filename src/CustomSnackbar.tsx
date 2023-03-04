import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';

interface CustomSnackbarProps {
	open: boolean;
	message: string;
	showClose?: boolean;
	onClose: () => void;
	type: 'success' | 'warning' | 'error' | string;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
	open,
	message,
	showClose = false,
	onClose,
	type,
}) => {
	const handleClose = (
		event: Event | React.SyntheticEvent<any, Event>,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return;
		}
		onClose();
	};

	const snackbarColor = () => {
		switch (type) {
		case 'success':
			return 'green';
		case 'info':
			return 'gray';
		case 'warning':
			return 'orange';
		case 'error':
			return 'red';
		default:
			return 'black';
		}
	};
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			sx={{ paddingTop: '60px' }}
			open={open}
			autoHideDuration={3000}
			onClose={handleClose}
		>
			<SnackbarContent
				style={{
					backgroundColor: snackbarColor(),
					minWidth: '0px',
					maxWidth: '255px',
				}}
				sx={{ minWidth: '0px', maxWidth: '50px' }}
				message={<span id='client-snackbar'>{message}</span>}
				action={
					showClose && [
						<IconButton
							key='close'
							aria-label='close'
							color='inherit'
							onClick={handleClose}
						>
							<CloseIcon />
						</IconButton>,
					]
				}
			/>
		</Snackbar>
	);
};

export default CustomSnackbar;
