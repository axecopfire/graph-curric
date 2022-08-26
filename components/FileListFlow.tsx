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

  useEffect(() => {
    if (timer < 5) {
      setTimeout(() => {
        setTimer(timer + 1);
      }, 100);
    }
    if (timer === 5) {
      const isNodeIntersect = (node1, node2) => {
        const xIntersect =
          node1.position.x + node1.width >= node2.position.x &&
          node1.position.x <= node2.position.x + node2.width;
        const yIntersect =
          node1.position.y + node1.height >= node2.position.y &&
          node1.position.y <= node2.position.y + node2.height;
        return xIntersect && yIntersect;
      };
      const hasIntersect =
        lastDraggedNode && !lastDraggedNode.parentNode
          ? nodes.filter((checkNode) => {
              if (checkNode.type !== "groupNode") return false;
              if (lastDraggedNode.id === checkNode.id) return false;
              return isNodeIntersect(lastDraggedNode, checkNode);
            })
          : [];
      if (hasIntersect.length) {
        const parentNode = hasIntersect[0];
        console.log(parentNode);
        const filteredArray = nodes.filter(
          (node) => node.id !== parentNode.id && node.id !== lastDraggedNode.id
        );
        const newNodeList = [
          ...filteredArray,
          {
            ...parentNode,
            data: {
              ...parentNode.data,
              width: parentNode.width + 100,
              height: parentNode.height + 100,
            },
          },
          {
            ...lastDraggedNode,
            parentNode: parentNode.id,
            extent: "parent",
          } as Node,
        ];

        setNodes([...newNodeList]);
      }
      // On intersection
      // update node to new parent
      // Make parent element bigger
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

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
