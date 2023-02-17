import { CSSProperties, useEffect, useRef, useState } from "react";
import { TreeNode } from "./tree";
import debounce from "lodash/debounce";

function NodeDisplay({ node, parentRef }: { node: TreeNode; parentRef: any }) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const [fromRect, setFromRest] = useState<DOMRect | null>(null);
  const [toRect, setToRest] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!parentRef) {
      console.log(`No parent (${nodeRef.current?.id}) skipping...`)
      return;
    }
    if (nodeRef.current) {
      setToRest(nodeRef.current.getBoundingClientRect());
    }
    if (parentRef.current) {
      setFromRest(parentRef.current.getBoundingClientRect());
    }
  }, [nodeRef.current]);

  if (fromRect && toRect) {
    console.log(`${parentRef.current.id} -> ${node.value}`, fromRect, toRect);
  }

  return (
    <div id={node.value} className="flex flex-col items-center">
      <div
        ref={nodeRef}
        id={node.value}
        className="w-24 h-24 m-2 flex justify-center items-center rounded-full bg-gray-600 mb-2"
      >
        {node.value}
      </div>
      <LineTo fromRect={fromRect} toRect={toRect} />
      {node.children && node.children.length > 0 && (
        <div className="flex">
          {node.children.map((child) => (
            <div key={child.value} className="">
              <NodeDisplay node={child} parentRef={nodeRef} />
              {/* <h1>{">" + nodeRef.current?.id + " | " + document.getElementById(node.value.toString())?.id}</h1> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TreeGraph({ root }: { root: TreeNode }) {
  return <div className="w-full flex justify-center">{renderNode(root)}</div>;

  function renderNode(node: TreeNode) {
    return <NodeDisplay key={node.value} node={node} parentRef={null} />;
  }
}

type Props = {
  fromRect: DOMRect | null;
  toRect: DOMRect | null;
};


const Line: React.FC<Props> = ({ fromRect, toRect }) => {
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
    <div style={style}>
      <svg style={svgStyle}>
        <path d={`M ${x1} ${y1} L ${x2} ${y2}`} style={pathStyle} />
      </svg>
    </div>
  );
};


function LineTo({
  fromRect,
  toRect,
}: {
  fromRect: DOMRect | null;
  toRect: DOMRect | null;
}) {
  console.log("LineTo")
  if (fromRect && toRect) {
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

    // console.log({ from: [x1, y1], to: [x2, y2] });

    const style: CSSProperties = {
      position: "absolute",
      left: left,
      top: top,
      width: width,
      height: height,
      pointerEvents: "none",
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
      // <div style={style}>
      //   <svg style={svgStyle}>
      //     <path d={`M ${x1} ${y1} L ${x2} ${y2}`} style={pathStyle} />
      //   </svg>
      // </div>
      // <div className="line ">
      //   <div
      //     id="from-parent"
      //     className={`absolute top-[${600}px] left-[${600}px] p-1 opacity-25 bg-red-500`}
      //   ></div>
      //   <div
      //     id="to-child"
      //     className={`absolute top-[${600}px] left-[${600}px] p-1 opacity-25 bg-blue-500`}
      //   ></div>
      // </div>
      <Line fromRect={fromRect} toRect={toRect} />
    );
  } else {
    console.log("null", {fromRect, toRect});
    return null;
  }
}

export default TreeGraph;
