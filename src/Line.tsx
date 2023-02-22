import React, { CSSProperties } from 'react';

type Props = {
	fromRect: DOMRect | null;
	toRect: DOMRect | null;
	showArrow?: boolean;
	dashed?: boolean;
	lineColor?: string;
};

const LineTo: React.FC<Props> = ({
	fromRect,
	toRect,
	showArrow = false,
	dashed = false,
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
		left: left,
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
		zIndex: -7,
	};

	// let x_start = x1;
	// let y_start = y1;

	// let x_end = x2;
	// let y_end = y2;

	// const slope = (y2 - y1) / (x2 - x1);
	// const theta = Math.atan(slope);
	// let x_var = 48 * Math.cos(theta);

	// let y_var = x_var * Math.tan(theta);

	// x_start = x1 + Math.sign(x2 - x1) * x_var;
	// y_start = x2 - x1 === 0 ? y1 + y_var : y1 + Math.sign(x2 - x1) * y_var;

	// if (showArrow) {
	// 	x_var += 20;
	// 	y_var = x_var * Math.tan(theta);
	// }

	// x_end = x2 - Math.sign(x2 - x1) * x_var;
	// y_end = x2 - x1 === 0 ? y2 - y_var : y2 - Math.sign(x2 - x1) * y_var;

	const dx = x2 - x1;
	const dy = y2 - y1;
	const arrowLength = showArrow ? 68 : 48;

	const len = Math.sqrt(dx * dx + dy * dy);
	const nx = dx / len;
	const ny = dy / len;

	const x_start = x1 + nx * 48;
	let y_start = y1 + ny * 48;

	const x_end = x2 - nx * arrowLength;
	let y_end = y2 - ny * arrowLength;

	if (dx === 0) {
		const sign = Math.sign(dy);
		const yOffset = sign * arrowLength;
		y_start = y1 + sign * 48;
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
							className='fill-gray-600 z-10'
							id='arrowhead'
							style={arrowHeadStyle}
							markerWidth='10'
							markerHeight='8'
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
