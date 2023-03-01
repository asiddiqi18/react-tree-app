import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack, TextField } from '@mui/material';

import { GenerateRandomTreeSettings } from '../types';

const schema = yup.object().shape({
	numberOfNodes: yup
		.number()
		.typeError('Must select a valid number for level height')
		.integer('Level height must be a whole number')
		.min(1, 'Level height must be at least 1')
		.required(),
});

function EditRandomTreeForm({
	randomTreeSettings,
	onSubmit,
}: {
	randomTreeSettings: GenerateRandomTreeSettings;
	onSubmit: (data: GenerateRandomTreeSettings) => void;
}) {
	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<GenerateRandomTreeSettings>({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (randomTreeSettings) {
			setValue('numberOfNodes', randomTreeSettings.numberOfNodes);
		}
	}, [randomTreeSettings]);

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3} marginY={2.5} mb={4}>
				<Controller
					name='numberOfNodes'
					control={control}
					defaultValue={48}
					render={({ field, fieldState }) => (
						<TextField
							{...field}
							error={fieldState.invalid}
							helperText={fieldState.invalid ? fieldState.error?.message : ''}
							id='standard-number'
							label='Number of nodes to generate'
							type='number'
							InputLabelProps={{
								shrink: true,
							}}
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

export default EditRandomTreeForm;
