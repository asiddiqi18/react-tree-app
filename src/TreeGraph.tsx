import React from 'react';
import { memo, useEffect, useRef, useState } from 'react';
import { Tree, TreeNode } from './tree';
import Line from './Line';
import { useWindowResize } from './useWindowSize';
import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
const NODE_WIDTH = '96px';
const NODE_HEIGHT = '96px';

function TreeGraph({
	tree,
	onNodeClick,
	onAddNode,
}: {
	tree: Tree;
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

		const bubble = () => {
			return (
				<div
					className='hover:brightness-95 hover:shadow-xl my-5 mx-2 px-2 flex justify-center items-center text-center rounded-full cursor-pointer '
					style={{
						width: NODE_WIDTH,
						height: NODE_HEIGHT,
						backgroundColor: node.attributes.backgroundColor,
						color: node.attributes.textColor,
						// borderStyle: 'inset',
						// borderWidth: 4,
						// borderColor: 'red',
					}}
					onClick={() => onNodeClick(node)}
					onMouseEnter={() => setHover(true)}
					onMouseLeave={() => setHover(false)}
				>
					<div className='flex flex-col justify-between items-center h-full'>
						<div className='flex-1'></div>
						<p className='pt-1 flex-1 break-words'>
							{node.id} - {node.attributes.value}
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
		};

		return bubble();
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
				<div ref={nodeRef} id={`${node.attributes.value}-node`}>
					<Node node={node} />
				</div>
				<Line
					key={node.id}
					fromRect={fromRect}
					toRect={toRect}
					lineColor={node.attributes.lineAttributes.lineColor}
					dashed={node.attributes.lineAttributes.dashed}
					showArrow={node.attributes.lineAttributes.showArrow}
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
