import React, { memo, useEffect, useRef, useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';

import Line from './Line';
import Node from './Node';
import { Tree, TreeNode } from './tree';
import { TreeSettings } from './types';
import { useWindowResize } from './useWindowSize';

function TreeGraph({
	tree,
	treeSettings,
	zoom,
	OnClickNode,
	onAddNode,
}: {
	tree: Tree;
	treeSettings: TreeSettings;
	zoom: number;
	OnClickNode: (node: TreeNode) => void;
	onAddNode: (node: TreeNode) => void;
}) {
	const [_width, _height] = useWindowResize();

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
					<div className='flex' style={{ columnGap: zoom * 16 }}>
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
						marginTop: zoom * (treeSettings.levelHeight / 2),
						marginBottom: zoom * (treeSettings.levelHeight / 2),
						marginLeft: zoom * (treeSettings.siblingSpace / 2),
						marginRight: zoom * (treeSettings.siblingSpace / 2),
					}}
				>
					<Node
						node={node}
						zoom={zoom}
						onAddNode={onAddNode}
						OnClickNode={OnClickNode}
					/>
				</div>
				<Line
					id={node.id}
					key={node.id}
					fromRect={fromRect}
					toRect={toRect}
					zoom={zoom}
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
		<div
			className='flex justify-center items-center'
			style={{ backgroundColor: treeSettings.backgroundColor }}
		>
			<RenderNode node={tree.root} />
		</div>
	);
}

export default memo(TreeGraph);
