import { memo, useEffect, useRef, useState } from "react";
import { Tree, TreeNode } from "./tree";
import Line from "./Line";
import { useWindowResize } from "./useWindowSize";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
let NODE_WIDTH = "96px";
const NODE_HEIGHT = "96px";

function TreeGraph({
  tree,
  onNodeClick,
  onAddNode,
}: {
  tree: Tree;
  onNodeClick: (node: TreeNode) => void;
  onAddNode: (node: TreeNode) => void;
}) {
  const [_width, _height] = useWindowResize();

  function Node({ node }: { node: TreeNode }) {
    const [hover, setHover] = useState<boolean>(false);

    const handlePlusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      console.log("clicked")
      onAddNode(node);
    }

    return (
      <div
        className="my-5 mx-2 px-2 flex justify-center items-center text-center rounded-full cursor-pointer "
        style={{
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          backgroundColor: node.color,
        }}
        onClick={() => onNodeClick(node)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div
          className="flex flex-col justify-between items-center h-full"
        >
          <div className="flex-1"></div>
          <p className="pt-1 flex-1 break-words">{node.value}</p>
            <div className="flex-1">
          {hover &&
              <IconButton
                onClick={(e) => handlePlusClick(e)}
                color="success"
                sx={{
                  "&:hover": {
                    backgroundColor: '#81c784'
                  },
                  height: 16,
                  width: 16,
                  bottom: 0,
                  padding: 1.4,
              
                }}
              >
                <AddIcon />
              </IconButton>
          }
            </div>
          
        </div>
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
              <div id={`${node.value}-children-${index}`} key={child.id}>
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
