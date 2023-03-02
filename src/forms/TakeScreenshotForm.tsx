import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	ButtonGroup,
	FormControlLabel,
	InputAdornment,
	Stack,
	TextField,
	ToggleButton,
	ToggleButtonGroup,
} from '@mui/material';

import { GenerateRandomTreeSettings, ScreenshotSettings } from '../types';

const schema = yup.object().shape({
	format: yup.string().required(),
	file_name: yup.string().required(),
});

function TakeScreenshotForm({
	onSubmit,
}: {
	onSubmit: (data: ScreenshotSettings) => void;
}) {
	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ScreenshotSettings>({
		resolver: yupResolver(schema),
		defaultValues: {
			file_name: '',
			format: 'PNG',
		},
	});

	watch('format');

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<p className='mb-2'>Choose format:</p>
			<Controller
				name='format'
				control={control}
				defaultValue='png'
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<ToggleButtonGroup
						aria-label='options'
						color='success'
						className='mb-3'
						value={value}
						exclusive
						onChange={(e, value) => {
							const options = value as string[];
							onChange(options);
						}}
					>
						<ToggleButton value='PNG'>PNG</ToggleButton>
						<ToggleButton value='JPEG'>JPEG</ToggleButton>
						<ToggleButton value='SVG'>SVG</ToggleButton>
					</ToggleButtonGroup>
				)}
			/>
			<Controller
				name='file_name'
				control={control}
				defaultValue=''
				render={({ field }) => (
					<TextField
						{...field}
						label='File Name'
						className='my-3'
						error={!!errors.file_name}
						helperText={errors.file_name?.message}
						fullWidth
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
									.{getValues('format').toLowerCase()}
								</InputAdornment>
							),
						}}
						margin='normal'
					/>
				)}
			/>
			<Stack spacing={3} marginY={5}>
				<Button type='submit' variant='contained' color='success'>
					Download
				</Button>
			</Stack>
		</form>
	);
}

export default TakeScreenshotForm;
