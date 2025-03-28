import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import UserNavBar from "./usernavbar";
import Tree from "react-d3-tree";

// Flat data (id, name, parentId, position)
const flatData = [
  { id: 1, name: "Alice", parentId: null, position: null },
  { id: 2, name: "Bob", parentId: 1, position: 0 },
  { id: 3, name: "Charlie", parentId: 1, position: 1 },
  { id: 4, name: "David", parentId: 2, position: 1 },
  { id: 5, name: "Eve", parentId: 2, position: 0 },
  { id: 6, name: "Frank", parentId: 3, position: 0 },
  { id: 7, name: "Grace", parentId: 3, position: 1 },
  { id: 8, name: "Hank", parentId: 4, position: 0 },
  { id: 9, name: "Ivy", parentId: 4, position: 1 },
  // { id: 10, name: "Jack", parentId: 5, position: 0 },
  // { id: 11, name: "Kathy", parentId: 5, position: 1 },
  // { id: 12, name: "Leo", parentId: 6, position: 0 },
  // { id: 13, name: "Mona", parentId: 6, position: 1 },
  // { id: 14, name: "Nina", parentId: 7, position: 0 }
];

// Function to build tree with greyed-out placeholders
const buildTree = (flatData, rootId) => {
  const nodeMap = new Map();

  flatData.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  if (!nodeMap.has(rootId)) return null;

  let root = nodeMap.get(rootId);

  const addChildren = (parentNode, level) => {
    if (level >= 4) return;

    let children = flatData
      .filter(node => node.parentId === parentNode.id)
      .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    let hasLeft = children.some(child => child.position === 0);
    let hasRight = children.some(child => child.position === 1);

    if (!hasLeft) {
      children.unshift({
        id: `ghost-${parentNode.id}-L`,
        parentId: parentNode.id,
        position: 0,
        isPlaceholder: true
      });
    }
    if (!hasRight) {
      children.push({
        id: `ghost-${parentNode.id}-R`,
        parentId: parentNode.id,
        position: 1,
        isPlaceholder: true
      });
    }

    if (children.length === 0) {
      children.push(
        { id: `ghost-${parentNode.id}-L`, parentId: parentNode.id, position: 0, isPlaceholder: true },
        { id: `ghost-${parentNode.id}-R`, parentId: parentNode.id, position: 1, isPlaceholder: true }
      );
    }

    children.forEach(child => {
      const childNode = nodeMap.get(child.id) || { ...child, children: [] };
      parentNode.children.push(childNode);
      if (!child.isPlaceholder) addChildren(childNode, level + 1);
    });
  };

  addChildren(root, 1);
  return root;
};

export default function BinaryTree() {
  const styles = `
    .node__leaf > circle {
      fill: white;
      r: 20;
      stroke: black;
      stroke-width: 2px;
    }
    .node__branch > circle {
      fill: gold;
      stroke: black;
      stroke-width: 2px;
    }
    .node__placeholder > circle {
      fill: none !important;
      stroke: grey !important;
      stroke-width: 2px;
    }
    .node__placeholder text {
      display: none;
    }
  `;

  const [treeData, setTreeData] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rootId, setRootId] = useState(1);
  const [selectedPath, setSelectedPath] = useState("diagonal"); // Default selected option
  const [selectedOrientation, setSelectedOrientation] = useState("vertical"); // Default selected option
  const navigate = useNavigate();

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    const newTree = buildTree(flatData, rootId);
    if (newTree) {
      setTreeData(newTree);
    }
  }, [rootId, selectedPath, selectedOrientation]);

  const handleNodeClick = useCallback(
    (nodeData) => {
      const clickedNodeId = nodeData.data.id;

      if (nodeData.data.isPlaceholder) return;

      if (nodeData.data.isJoinNode) {
        navigate("/signup");
      } else if (clickedNodeId === rootId) {
        const parent = flatData.find(node => node.id === rootId)?.parentId;
        if (parent) {
          setRootId(parent);
        }
      } else {
        setRootId(clickedNodeId);
      }
    },
    [rootId, navigate]
  );

  const handlePathFuncSelection = (event) => {
    setSelectedPath(event.target.value);
  };

  const handleSelectOrientation = (event) => {
    setSelectedOrientation(event.target.value);
  };
  return (
    <>
      <style>{styles}</style>
      <UserNavBar />
      <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-100 rounded">
      <div style={{ width: "100%", height: "80vh", position: "relative", paddingTop: "18em" }}>
          <label htmlFor="path-select">Path Function:</label>
          <select id="path-select" value={selectedPath} onChange={handlePathFuncSelection}>
            <option value="diagonal">Diagonal</option>
            <option value="elbow">Elbow</option>
            <option value="straight">Straight</option>
            <option value="step">Step</option>
          </select>
        </div>
        <div style={{ width: "100%", height: "80vh", position: "relative" }}>
          <label htmlFor="Orientation">Orientation:</label>
          <select id="Orientation" value={selectedOrientation} onChange={handleSelectOrientation}>
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
          </select>
        </div>
      </div>
      <div className="p-4 bg-blue-200 rounded">
      <div style={{ width: "100%", height: "100%", position: "relative", border: "solid 2px black", float: "right" }}>
          {treeData ? (
            <Tree
              data={treeData}
              orientation={selectedOrientation}
              translate={{ x: dimensions.width / 5, y: dimensions.height / 5 }}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              pathFunc={selectedPath}
              onNodeClick={handleNodeClick}
              rootNodeClassName="node__branch"
              branchNodeClassName="node__branch"
              leafNodeClassName="node__leaf"
              nodeClassName={(nodeData) =>
                nodeData.data.isPlaceholder ? "node__placeholder" : ""
              }
              // zoom={0.5}
            />
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              No Data Available
            </p>
          )}
        </div>
      </div>

      </div>
    </>
  );
}
