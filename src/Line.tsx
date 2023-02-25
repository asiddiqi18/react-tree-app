import React, { CSSProperties } from 'react';

type LineProps = {
	fromRect: DOMRect | null;
	toRect: DOMRect | null;
	showArrow?: boolean;
	dashedLine?: boolean;
	lineColor?: string;
};

const LineTo: React.FC<LineProps> = ({
	fromRect,
	toRect,
	showArrow = false,
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

	const style: CSSProperties = {
		position: 'absolute',
		left: left + window.pageXOffset,
		top: top + window.pageYOffset,
		width: width,
		height: height,
		pointerEvents: 'none',
	};
	const svgStyle: CSSProperties = {
		position: 'absolute',
		left: 0,
		top: 0,
		width: width,
		height: height,
		pointerEvents: 'none',
		// zIndex: -1,
	};
	const primaryLineStyle: CSSProperties = {
		position: 'relative',
		fill: 'none',
		stroke: lineColor,
		strokeWidth: '2px',
		strokeDasharray: dashed ? '4' : undefined,
		zIndex: -10,
	};

	const arrowHeadStyle: CSSProperties = {
		position: 'relative',
		fill: lineColor,
	};

	const majorAxis = fromRect.width;
	const minorAxis = fromRect.height;
	const arrowLength = 20;

	const dx = x2 - x1;
	const dy = y2 - y1;

	// Calculate the angle between the x-axis and the major axis
	const angle = Math.atan2(dy, dx);

	// Calculate the distances from the center to the edge along the major and minor axes
	const a_from = majorAxis / 2;
	const b_from = minorAxis / 2;

	const a_to = toRect.width / 2;
	const b_to = toRect.height / 2;

	const [sin, cos] = [Math.sin(angle), Math.cos(angle)];

	const radius = Math.sqrt(
		(a_to * a_to * b_to * b_to) /
			(b_to * b_to * cos * cos + a_to * a_to * sin * sin)
	);

	const cutOffLength = radius + (showArrow ? arrowLength : 0);

	// Calculate the normalized vector from the center to the end point
	const len = Math.sqrt(dx * dx + dy * dy);
	const nx = dx / len;
	const ny = dy / len;

	// Calculate the starting and ending points of the arrow
	const x_start = x1 + a_from * cos;
	let y_start = y1 + b_from * sin;

	const x_end = x2 - nx * cutOffLength;
	let y_end = y2 - ny * cutOffLength;

	if (dx === 0) {
		const sign = Math.sign(dy);
		const yOffset = sign * cutOffLength;
		y_start = y1 + sign * radius;
		y_end = y2 - yOffset;
	}

	return (
		<div className='line' style={style}>
			<svg style={svgStyle}>
				<path
					id='primary-line'
					d={`M ${x_start} ${y_start} L ${x_end} ${y_end}`}
					style={primaryLineStyle}
					markerEnd={showArrow ? 'url(#arrowhead)' : ''}
				/>
				{showArrow && (
					<defs>
						<marker
							id='arrowhead'
							style={arrowHeadStyle}
							markerWidth='10'
							markerHeight='7'
							refX='0'
							refY='3.5'
							orient='auto'
						>
							<polygon points='0 0, 10 3.5, 0 7' />
						</marker>
					</defs>
				)}
			</svg>
		</div>
	);
};

export default LineTo;
