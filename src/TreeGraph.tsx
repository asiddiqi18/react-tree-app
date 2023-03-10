import React, { memo, useEffect, useRef, useState } from 'react';

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
					<div
						id={`${node.attributes.value}-forest`}
						className='flex'
						style={{ columnGap: zoom * 16 }}
					>
						{node.children.map((child, index) => (
							<div
								id={`${node.attributes.value}-children-${index}`}
								className={
									treeSettings.reverse
										? 'flex flex-col justify-end'
										: 'flex flex-col'
								}
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
		const hasChildren = node.children?.length > 0;

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

		return (
			<div
				id={node.attributes.value}
				className={
					treeSettings.reverse
						? 'flex flex-col-reverse items-center'
						: 'flex flex-col items-center'
				}
			>
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
						reverse={treeSettings.reverse}
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

	return (
		<div
			className='flex justify-center items-center'
			style={{ backgroundColor: treeSettings.backgroundColor }}
		>
			<NodeTree
				key={tree.root.attributes.value}
				node={tree.root}
				parentRef={null}
			/>
		</div>
	);
}

export default memo(TreeGraph);
