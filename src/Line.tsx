import React from 'react';

type LineProps = {
	id: number;
	fromRect: DOMRect | null;
	toRect: DOMRect | null;
	arrowType?: string;
	dashedLine?: boolean;
	lineColor?: string;
};

const LineTo: React.FC<LineProps> = ({
	id,
	fromRect,
	toRect,
	arrowType,
	dashedLine: dashed = false,
	lineColor = 'black',
}) => {
	if (!fromRect || !toRect) {
		return null;
	}

	const left = Math.min(fromRect.left, toRect.left);
	const right = Math.max(fromRect.right, toRect.right);
	const top = Math.min(fromRect.top, toRect.top);
	const bottom = Math.max(fromRect.bottom, toRect.bottom);
	const width = right - left;
	const height = bottom - top;
	const x1 = fromRect.left + fromRect.width / 2 - left;
	const y1 = fromRect.top + fromRect.height / 2 - top;
	const x2 = toRect.left + toRect.width / 2 - left;
	const y2 = toRect.top + toRect.height / 2 - top;

	const arrowLength = 20;

	const dx = x2 - x1;
	const dy = y2 - y1;

	// Calculate the angle between the x-axis and the major axis
	const angle = Math.atan2(dy, dx);

	// Calculate the distances from the center to the edge along the major and minor axes
	const a_from = fromRect.width / 2;
	const b_from = fromRect.height / 2;

	const a_to = toRect.width / 2;
	const b_to = toRect.height / 2;

	const [sin, cos] = [Math.sin(angle), Math.cos(angle)];

	const radius_from = Math.sqrt(
		(a_from * a_from * b_from * b_from) /
			(b_from * b_from * cos * cos + a_from * a_from * sin * sin)
	);

	const radius_to = Math.sqrt(
		(a_to * a_to * b_to * b_to) /
			(b_to * b_to * cos * cos + a_to * a_to * sin * sin)
	);

	const cutOffLengthStart =
		radius_from +
		(arrowType === 'to' || arrowType === 'both' ? arrowLength : 0);

	const cutOffLengthEnd =
		radius_to +
		(arrowType === 'from' || arrowType === 'both' ? arrowLength : 0);

	// Calculate the normalized vector from the center to the end point
	const len = Math.sqrt(dx * dx + dy * dy);
	const nx = dx / len;
	const ny = dy / len;

	// Calculate the starting and ending points of the arrow
	const x_start = x1 + nx * cutOffLengthStart;
	let y_start = y1 + ny * cutOffLengthStart;

	const x_end = x2 - nx * cutOffLengthEnd;
	let y_end = y2 - ny * cutOffLengthEnd;

	if (dx === 0) {
		const sign = Math.sign(dy);
		const yOffsetStart = sign * cutOffLengthStart;
		const yOffsetEnd = sign * cutOffLengthEnd;
		y_start = y1 + yOffsetStart;
		y_end = y2 - yOffsetEnd;
	}

	const url = `arrowhead-${id}`;

	return (
		<div
			className='line absolute pointer-events-none'
			style={{
				left: left + window.pageXOffset,
				top: top + window.pageYOffset,
				width: width,
				height: height,
			}}
		>
			<svg
				className='absolute pointer-events-none'
				style={{
					left: 0,
					top: 0,
					width: width,
					height: height,
				}}
			>
				<path
					id='primary-line'
					className='relative fill-none stroke-[2px]'
					d={`M ${x_start} ${y_start} L ${x_end} ${y_end}`}
					style={{
						stroke: lineColor,
						strokeDasharray: dashed ? '4' : undefined,
					}}
					markerStart={
						arrowType === 'to' || arrowType === 'both' ? `url(#${url})` : ''
					}
					markerEnd={
						arrowType === 'from' || arrowType === 'both' ? `url(#${url})` : ''
					}
				/>
				<defs>
					<marker
						id={url}
						className='relative'
						style={{
							fill: lineColor,
							visibility: arrowType !== 'none' ? 'visible' : 'hidden',
						}}
						markerWidth='10'
						markerHeight='7'
						refX='0'
						refY='3.5'
						orient='auto-start-reverse'
					>
						<polygon points='0 0, 10 3.5, 0 7' />
					</marker>
				</defs>
			</svg>
		</div>
	);
};

export default LineTo;
