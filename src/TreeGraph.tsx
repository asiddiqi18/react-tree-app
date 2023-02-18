import { useEffect, useRef, useState } from "react";
import { Tree, TreeNode } from "./tree";
import Line from "./Line";
import { useWindowResize } from "./useWindowSize";

let NODE_WIDTH = "96px";
const NODE_HEIGHT = "96px";

function NodeDisplay({
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
      console.log(`No parent (${nodeRef.current?.id}) skipping...`);
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
    <div id={node.value} className="flex flex-col items-center">
      <div
        ref={nodeRef}
        id={`${node.value}-node`}
        className="my-5 mx-2 px-2 flex justify-center items-center text-center rounded-full bg-gray-600"
        style={{
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
        }}
      >
        <p className="break-words">{node.value}</p>
      </div>
      {/* <hr className="border-4 h-4 w-full" /> */}
      <Line fromRect={fromRect} toRect={toRect} />
      {node.children && node.children.length > 0 && (
        <div className="flex gap-x-4">
          {node.children.map((child, index) => (
            <div id={`${node.value}-children-${index}`} key={child.value}>
              <NodeDisplay node={child} parentRef={nodeRef} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TreeGraph({ tree }: { tree: Tree }) {

  const [width, height] = useWindowResize();

  // NODE_WIDTH = width / (5 + tree.largestLevelSize()) + 'px';

  return <div className="w-full flex justify-center">{renderNode(tree.root)}</div>;

  function renderNode(node: TreeNode) {
    return <NodeDisplay key={node.value} node={node} parentRef={null} />;
  }
}

export default TreeGraph;
