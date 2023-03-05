import { matchIsValidColor, MuiColorInput } from 'mui-color-input';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Checkbox,
	FormControlLabel,
	Stack,
	TextField,
} from '@mui/material';

import { TreeSettings } from '../types';

const schema = yup.object().shape({
	backgroundColor: yup.string().required('value is required'),
	levelHeight: yup
		.number()
		.typeError('Must select a valid number for level height')
		.integer('Level height must be a whole number')
		.min(1, 'Level height must be at least 1')
		.required(),
	siblingSpace: yup
		.number()
		.typeError('Must select a valid number for level height')
		.integer('Level height must be a whole number')
		.min(1, 'Level height must be at least 1')
		.required(),
});

function EditTreeForm({
	treeSettings,
	onSubmit,
}: {
	treeSettings: TreeSettings;
	onSubmit: (data: TreeSettings) => void;
}) {
	const { control, handleSubmit, setValue } = useForm<TreeSettings>({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (treeSettings) {
			setValue('backgroundColor', treeSettings.backgroundColor);
			setValue('levelHeight', treeSettings.levelHeight);
			setValue('siblingSpace', treeSettings.siblingSpace);
			setValue('reverse', treeSettings.reverse);
		}
	}, [treeSettings]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3} marginY={2.5} mb={4}>
				<Controller
					name='backgroundColor'
					control={control}
					defaultValue='#ffffff'
					rules={{ validate: matchIsValidColor }}
					render={({ field, fieldState }) => (
						<MuiColorInput
							{...field}
							label='Background color'
							className='my-3'
							isAlphaHidden
							format='hex'
							helperText={fieldState.invalid ? 'Color is invalid' : ''}
							error={fieldState.invalid}
						/>
					)}
				/>
				<Controller
					name='levelHeight'
					control={control}
					defaultValue={48}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							error={fieldState.invalid}
							helperText={fieldState.invalid ? fieldState.error?.message : ''}
							id='standard-number'
							label='Level height'
							type='number'
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: '10',
							}}
						/>
					)}
				/>
				<Controller
					name='siblingSpace'
					control={control}
					defaultValue={5}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							error={fieldState.invalid}
							helperText={fieldState.invalid ? fieldState.error?.message : ''}
							id='standard-number'
							label='Node horizontal margin'
							type='number'
							InputLabelProps={{
								shrink: true,
							}}
							inputProps={{
								step: '10',
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name='reverse'
					defaultValue={false}
					render={({ field }) => (
						<FormControlLabel
							label='Vertically reverse tree'
							control={<Checkbox {...field} checked={field.value} />}
						/>
					)}
				/>
			</Stack>

			<Stack spacing={3} marginY={5}>
				<Button type='submit' variant='contained' color='primary'>
					Save
				</Button>
			</Stack>
		</form>
	);
}

export default EditTreeForm;
