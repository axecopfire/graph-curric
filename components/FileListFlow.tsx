import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
  Node,
} from "react-flow-renderer";
import GroupNode from "./CustomNodes/GroupNode";
import ChildNode from "./CustomNodes/ChildNode";
import useGroupNode from "hooks/useGroupNode";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "groupNode",
    data: { label: "Group Node", width: 200, height: 100 },
    position: { x: 250, y: 25 },
    width: 150,
    height: 50,
  },

  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
    width: 200,
    height: 100,
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
    width: 200,
    height: 100,
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

const nodeTypes = {
  groupNode: GroupNode,
  childNode: ChildNode,
};

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes as Node[]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [timer, setTimer] = useState(0);
  const [lastDraggedNode, setLastDraggedNode] = useState<undefined | Node>();

  // Currently does not work
  // useGroupNode({
  //   nodes,
  //   setNodes,
  //   lastDraggedNode,
  //   timer,
  //   setTimer,
  // });

  const customOnNodesChange = useCallback(
    (changes) => {
      setTimer(0);
      return setNodes((nds) => {
        const dragged = nds.find((node) => node.dragging);
        setLastDraggedNode(dragged);
        return applyNodeChanges(changes, nds);
      });
    },
    [setNodes]
  );
  const customOnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "500px",
        border: "2px solid gray",
        borderRadius: "10px",
      }}
    >
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={customOnNodesChange}
        onEdgesChange={customOnEdgesChange}
        fitView
      />
    </div>
  );
}

export default Flow;
