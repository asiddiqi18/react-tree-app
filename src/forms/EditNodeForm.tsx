import { matchIsValidColor, MuiColorInput } from 'mui-color-input';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import {
	Button,
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';

import { TreeNode } from '../tree';
import { TreeNodeAttributes } from '../types';

const schema = yup.object().shape({
	value: yup.string().required('value is required'),
	nodeHeight: yup
		.number()
		.typeError('Must select a valid number for node height')
		.integer('Node height must be a whole number')
		.min(1, 'Node height must be at least 1')
		.required(),
	nodeWidth: yup
		.number()
		.typeError('Must select a valid number for node width')
		.integer('Node width must be a whole number')
		.min(1, 'Node width must be at least 1')
		.required(),
});

function EditNodeForm({
	selectedNode,
	onSubmit,
	onDelete,
	onInvert,
	onShift,
}: {
	selectedNode: TreeNode;
	onSubmit: (data: TreeNodeAttributes) => void;
	onDelete: (node: TreeNode) => void;
	onInvert: (node: TreeNode) => void;
	onShift: (node: TreeNode, direction: 'left' | 'right') => void;
}) {
	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<TreeNodeAttributes>({
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		if (selectedNode) {
			setValue('value', selectedNode.attributes.value);
			setValue('backgroundColor', selectedNode.attributes.backgroundColor);
			setValue('textColor', selectedNode.attributes.textColor);
			setValue('nodeWidth', selectedNode.attributes.nodeWidth);
			setValue('nodeHeight', selectedNode.attributes.nodeHeight);
			setValue(
				'lineAttributes.lineColor',
				selectedNode.attributes.lineAttributes.lineColor
			);
			setValue(
				'lineAttributes.dashedLine',
				selectedNode.attributes.lineAttributes.dashedLine
			);
			setValue(
				'lineAttributes.arrowType',
				selectedNode.attributes.lineAttributes.arrowType
			);
		}
	}, [selectedNode]);
	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3} marginX={2.5} mb={4}>
				<h2>Node Attributes</h2>
				<Controller
					name='value'
					control={control}
					defaultValue=''
					render={({ field }) => (
						<TextField
							{...field}
							label='Name'
							className='my-3'
							error={!!errors.value}
							helperText={errors.value?.message}
							fullWidth
							multiline
							maxRows={4}
							margin='normal'
						/>
					)}
				/>
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
					name='textColor'
					control={control}
					defaultValue='#ffffff'
					rules={{ validate: matchIsValidColor }}
					render={({ field, fieldState }) => (
						<MuiColorInput
							{...field}
							label='Text color'
							className='my-3'
							isAlphaHidden
							format='hex'
							helperText={fieldState.invalid ? 'Color is invalid' : ''}
							error={fieldState.invalid}
						/>
					)}
				/>
			</Stack>
			<Divider />
			<Stack gap={3} marginX={2.5} marginY={2}>
				<h2>Line Attributes</h2>
				<Controller
					name='lineAttributes.lineColor'
					control={control}
					defaultValue='#000000'
					rules={{ validate: matchIsValidColor }}
					render={({ field, fieldState }) => (
						<MuiColorInput
							{...field}
							label='Line color'
							className='my-3'
							isAlphaHidden
							format='hex'
							helperText={fieldState.invalid ? 'Color is invalid' : ''}
							error={fieldState.invalid}
						/>
					)}
				/>
				<FormGroup className='w-full flex justify-between' row>
					<Controller
						name='lineAttributes.dashedLine'
						control={control}
						defaultValue={false}
						render={({ field }) => (
							<FormControlLabel
								checked={getValues('lineAttributes.dashedLine') ?? false}
								control={<Checkbox {...field} />}
								label='Dashed Line'
							/>
						)}
					/>
					<Controller
						name='lineAttributes.arrowType'
						control={control}
						defaultValue={'none'}
						render={({ field }) => (
							<FormControl className='w-1/2'>
								<InputLabel id='demo-simple-select-label'>Age</InputLabel>
								<Select
									{...field}
									labelId='demo-simple-select-label'
									id='demo-simple-select'
									label='Age'
								>
									<MenuItem value={'none'}>None</MenuItem>
									<MenuItem value={'to'}>
										<ArrowRightAltIcon className='mr-3' />
										To
									</MenuItem>
									<MenuItem value={'from'}>
										<ArrowRightAltIcon className='rotate-180 mr-3' />
										From
									</MenuItem>
									<MenuItem value={'both'}>
										<SyncAltIcon className='mr-3' /> Both
									</MenuItem>
								</Select>
							</FormControl>
						)}
					/>
				</FormGroup>
			</Stack>
			<Divider />
			<Stack gap={3} marginX={2.5} marginY={2}>
				<h2>Size and Position</h2>
				<div className='flex gap-4 justify-between'>
					<Controller
						name='nodeWidth'
						control={control}
						defaultValue={96}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								error={fieldState.invalid}
								helperText={fieldState.invalid ? fieldState.error?.message : ''}
								id='standard-number'
								label='Node Width'
								type='number'
								inputProps={{
									step: '10',
								}}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
					<Controller
						name='nodeHeight'
						control={control}
						defaultValue={96}
						render={({ field, fieldState }) => (
							<TextField
								{...field}
								error={fieldState.invalid}
								helperText={fieldState.invalid ? fieldState.error?.message : ''}
								id='standard-number'
								label='Node Height'
								type='number'
								inputProps={{
									step: '10',
								}}
								InputLabelProps={{
									shrink: true,
								}}
							/>
						)}
					/>
				</div>
				<div className='flex gap-1 justify-between'>
					<Button
						startIcon={<KeyboardDoubleArrowLeftIcon />}
						variant='contained'
						className='w-1/2'
						color='info'
						onClick={() => onShift(selectedNode, 'left')}
					>
						Shift left
					</Button>
					<Button
						endIcon={<KeyboardDoubleArrowRightIcon />}
						variant='contained'
						className='w-1/2'
						color='info'
						onClick={() => onShift(selectedNode, 'right')}
					>
						Shift right
					</Button>
				</div>
				<Button
					variant='contained'
					color='success'
					onClick={() => {
						if (selectedNode) {
							onInvert(selectedNode);
						}
					}}
				>
					Invert
				</Button>
			</Stack>
			<Divider />
			<Stack spacing={3} marginX={2.5} marginY={5}>
				<Button
					variant='contained'
					color='error'
					onClick={() => {
						if (selectedNode) {
							onDelete(selectedNode);
						}
					}}
				>
					Delete
				</Button>
				<Button type='submit' variant='contained' color='primary'>
					Save
				</Button>
			</Stack>
		</form>
	);
}

export default EditNodeForm;
