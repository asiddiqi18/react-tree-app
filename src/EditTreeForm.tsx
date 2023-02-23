import { matchIsValidColor, MuiColorInput } from 'mui-color-input';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import {
	Button,
	Checkbox,
	FormControlLabel,
	FormGroup,
	Stack,
	TextField,
} from '@mui/material';

export type EditTreeFormInputs = {
	backgroundColor: string;
	nodeResize: boolean;
	levelHeight: number;
	siblingSpace: number;
};

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
	treeSettings: EditTreeFormInputs;
	onSubmit: (data: EditTreeFormInputs) => void;
}) {
	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<EditTreeFormInputs>({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (treeSettings) {
			setValue('backgroundColor', treeSettings.backgroundColor);
			setValue('nodeResize', treeSettings.nodeResize);
			setValue('levelHeight', treeSettings.levelHeight);
			setValue('siblingSpace', treeSettings.siblingSpace);
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
						/>
					)}
				/>
				<FormGroup row>
					<Controller
						name='nodeResize'
						control={control}
						defaultValue={false}
						render={({ field }) => (
							<FormControlLabel
								checked={getValues('nodeResize') ?? false}
								control={<Checkbox {...field} />}
								label='Resize nodes to fit text'
							/>
						)}
					/>
				</FormGroup>
			</Stack>

			<Stack spacing={3} marginX={2.5} marginY={5}>
				<Button
					type='submit'
					variant='contained'
					color='primary'
					onClick={() => console.log('Test')}
				>
					Save
				</Button>
			</Stack>
		</form>
	);
}

export default EditTreeForm;
