import { CSSProperties } from "react";

type Props = {
  fromRect: DOMRect | null;
  toRect: DOMRect | null;
};

const LineTo: React.FC<Props> = ({ fromRect, toRect }) => {
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
    position: "absolute",
    left: left,
    top: top,
    width: width,
    height: height,
    pointerEvents: "none",
    zIndex: -1,
  };
  const svgStyle: CSSProperties = {
    position: "absolute",
    left: 0,
    top: 0,
    width: width,
    height: height,
    pointerEvents: "none",
  };
  const pathStyle: CSSProperties = {
    fill: "none",
    stroke: "black",
    strokeWidth: "2px",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <div className="line" style={style}>
      <svg style={svgStyle}>
        <path d={`M ${x1} ${y1} L ${x2} ${y2}`} style={pathStyle} />
      </svg>
    </div>
  );
};

export default LineTo;
