import React, { memo, useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';

import Line from './Line';
import { Tree, TreeNode } from './tree';
import { TreeSettings } from './types';
import { useWindowResize } from './useWindowSize';

function TreeGraph({
	tree,
	treeSettings,
	onNodeClick,
	onAddNode,
}: {
	tree: Tree;
	treeSettings: TreeSettings;
	onNodeClick: (node: TreeNode) => void;
	onAddNode: (node: TreeNode) => void;
}) {
	const [_width, _height] = useWindowResize();

	function Node({ node }: { node: TreeNode }) {
		const [hover, setHover] = useState<boolean>(false);

		const handlePlusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			onAddNode(node);
		};

		return (
			<div
				className=' hover:brightness-95 rounded-[50%] hover:shadow-xl px-2 flex justify-center items-center text-center cursor-pointer'
				style={{
					width: node.attributes.nodeWidth,
					height: node.attributes.nodeHeight,
					backgroundColor: node.attributes.backgroundColor,
					color: node.attributes.textColor,
				}}
				onClick={() => onNodeClick(node)}
				onMouseEnter={() => setHover(true)}
				onMouseLeave={() => setHover(false)}
			>
				<div className='flex flex-col justify-between items-center h-full'>
					<div className='flex-1'></div>
					<p className='pt-1 flex-1 break-words'>{node.attributes.value}</p>
					<div className='flex-1'>
						{hover && (
							<IconButton
								onClick={(e) => handlePlusClick(e)}
								color='success'
								sx={{
									'&:hover': {
										backgroundColor: '#81c784',
									},
									height: 16,
									width: 16,
									bottom: 0,
									padding: 1.4,
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

	function NodeForest({
		node,
		parentRef,
	}: {
		node: TreeNode;
		parentRef: React.RefObject<HTMLDivElement> | null;
	}) {
		return (
			<>
				{node.children && node.children.length > 0 && (
					<div className='flex gap-x-4'>
						{node.children.map((child, index) => (
							<div
								id={`${node.attributes.value}-children-${index}`}
								key={child.id}
							>
								<NodeTree node={child} parentRef={parentRef} />
							</div>
						))}
					</div>
				)}
			</>
		);
	}

	function NodeTree({
		node,
		parentRef,
	}: {
		node: TreeNode;
		parentRef: React.RefObject<HTMLDivElement> | null;
	}) {
		const nodeRef = useRef<HTMLDivElement>(null);

		const [fromRect, setFromRect] = useState<DOMRect | null>(null);
		const [toRect, setToRect] = useState<DOMRect | null>(null);
		const [width, height] = useWindowResize();

		useEffect(() => {
			if (!parentRef) {
				return;
			}
			if (nodeRef.current) {
				setToRect(nodeRef.current.getBoundingClientRect());
			}
			if (parentRef.current) {
				setFromRect(parentRef.current.getBoundingClientRect());
			}
		}, [nodeRef, parentRef, width, height]);

		const hasChildren = node.children?.length > 0;

		return (
			<div id={node.attributes.value} className='flex flex-col items-center'>
				<div
					ref={nodeRef}
					id={`${node.attributes.value}-node`}
					style={{
						marginTop: treeSettings.levelHeight / 2,
						marginBottom: treeSettings.levelHeight / 2,
						marginLeft: treeSettings.siblingSpace / 2,
						marginRight: treeSettings.siblingSpace / 2,
					}}
				>
					<Node node={node} />
				</div>
				<Line
					id={node.id}
					key={node.id}
					fromRect={fromRect}
					toRect={toRect}
					{...node.attributes.lineAttributes}
				/>
				{hasChildren && <NodeForest node={node} parentRef={nodeRef} />}
			</div>
		);
	}

	function RenderNode({ node }: { node: TreeNode }) {
		return (
			<NodeTree key={node.attributes.value} node={node} parentRef={null} />
		);
	}

	return (
		<div className='w-full flex justify-center'>
			<RenderNode node={tree.root} />
		</div>
	);
}

export default memo(TreeGraph);
