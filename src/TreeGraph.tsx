import { memo, useEffect, useRef, useState } from "react";
import { Tree, TreeNode } from "./tree";
import Line from "./Line";
import { useWindowResize } from "./useWindowSize";

let NODE_WIDTH = "96px";
const NODE_HEIGHT = "96px";

function TreeGraph({ tree, onNodeClick }: { tree: Tree, onNodeClick: (node: TreeNode) => void }) {
  const [_width, _height] = useWindowResize();

  function Node({ node }: { node: TreeNode }) {
    return (
      <div
        className="my-5 mx-2 px-2 flex justify-center items-center text-center rounded-full cursor-pointer"
        style={{
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          backgroundColor: node.color,
        }}
        onClick={() => onNodeClick(node)}
      >
        <p className="break-words">{node.value}</p>
      </div>
    );
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
          <div className="flex gap-x-4">
            {node.children.map((child, index) => (
              <div id={`${node.value}-children-${index}`} key={child.value}>
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
        // console.log(`No parent (${nodeRef.current?.id}) skipping...`);
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
      <div id={node.value} className="flex flex-col items-center">
        <div ref={nodeRef} id={`${node.value}-node`}>
          <Node node={node} />
        </div>
        <Line fromRect={fromRect} toRect={toRect} />
        {hasChildren && <NodeForest node={node} parentRef={nodeRef} />}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">{renderNode(tree.root)}</div>
  );

  function renderNode(node: TreeNode) {
    return <NodeTree key={node.value} node={node} parentRef={null} />;
  }
}

export default memo(TreeGraph);
