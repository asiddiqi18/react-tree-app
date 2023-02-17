import { useEffect, useRef, useState } from "react";
import { TreeNode } from "./tree";
import Line from "./Line";

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
      <Line fromRect={fromRect} toRect={toRect} />
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






export default TreeGraph;
