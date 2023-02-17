import React from "react";
import "./App.css";
import { Tree } from "./tree";
import TreeGraph from "./TreeGraph";

function createTreeObj() {
  const tree = new Tree("root");
  const node1 = tree.addNode(tree.root, "child1");
  const node2 = tree.addNode(tree.root, "child2");
  const node3 = tree.addNode(node1, "grandchild1.1");
  const node4 = tree.addNode(node1, "grandchild1.2");
  const node5 = tree.addNode(node1, "grandchild1.3");
  const node6 = tree.addNode(node5, "great-grandchild1.3.1");
  const node7 = tree.addNode(node2, "grandchild2.1");
  const node8 = tree.addNode(node2, "grandchild2.2");
  const node9 = tree.addNode(node7, "great-grandchild2.2.1");
  const node10 = tree.addNode(node7, "great-grandchild2.2.2");
  const node11 = tree.addNode(node7, "great-grandchild2.2.3");
  const node12 = tree.addNode(node7, "great-grandchild2.2.4");
  const node13 = tree.addNode(node11, "great-grandchild2.2.4.1");
  const node14 = tree.addNode(node11, "great-grandchild2.2.4.2");

  return tree;
}

function showTree() {
  const tree = createTreeObj();

  const treeBFS = tree.BFS();

  return (
    <div className="flex flex-col">
      {treeBFS.map((level, levelNumber) => (
        <div key={levelNumber} className="m-5">
          <h1 className="font-bold">Level {levelNumber}</h1>
          <div className="flex justify-center">
            {level.map((itm, index) => (
              <div key={index}>{itm.value}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function App() {
  const tree = createTreeObj();

  return <div className="mt-40">
    {/* <div className="mt-5 text-center">{showTree()}</div> */}
    <TreeGraph root={tree.root} />
  </div>
}

export default App;
