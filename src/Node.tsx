import React, { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';

import { TreeNode } from './tree';

export default function Node({
	node,
	zoom,
	onAddNode,
	OnClickNode,
}: {
	node: TreeNode;
	zoom: number;
	OnClickNode: (node: TreeNode) => void;
	onAddNode: (node: TreeNode) => void;
}) {
	const [hover, setHover] = useState<boolean>(false);

	const handlePlusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		onAddNode(node);
	};

	return (
		<div
			className='hover:brightness-95 rounded-[50%] hover:shadow-xl px-2 flex justify-center items-center text-center cursor-pointer'
			style={{
				width: zoom * node.attributes.nodeWidth,
				height: zoom * node.attributes.nodeHeight,
				backgroundColor: node.attributes.backgroundColor,
				color: node.attributes.textColor,
			}}
			onClick={() => OnClickNode(node)}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className='flex flex-col justify-between items-center h-full'>
				<div className='flex-1'></div>
				<p
					className='pt-1 flex-1 break-words'
					style={{
						fontSize: zoom * 16,
					}}
				>
					{node.attributes.value}
				</p>
				<div className='flex-1'>
					{hover && (
						<IconButton
							onClick={(e) => handlePlusClick(e)}
							color='success'
							sx={{
								'&:hover': {
									backgroundColor: '#81c784',
								},
								height: zoom * 18,
								width: zoom * 18,
								bottom: 0,
								padding: zoom * 1.4,
							}}
						>
							<AddIcon />
						</IconButton>
					)}
				</div>
			</div>
		</div>
	);
}
