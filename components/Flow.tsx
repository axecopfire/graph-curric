import { useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

export const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
  },

  {
    id: "2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
  },
  {
    id: "3",
    type: "output",
    data: { label: "Output Node" },
    position: { x: 250, y: 250 },
  },
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3", animated: true },
];

function Flow({ md }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(md.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(md.edges);

  // If we click render button, set back to default
  useEffect(() => {
    setNodes(md.nodes);
    setEdges(md.edges);
  }, [md, setNodes, setEdges]);

  return (
    <>
      {nodes && edges ? (
        <div
          style={{
            width: "50vw",
            height: "250px",
            border: "2px solid gray",
            borderRadius: "10px",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView={true}

            // onNodesChange={onNodeChange}
            // onEdgesChange={onEdgesChange}
            // onConnect={onConnect}
          >
            {/* <MiniMap />
      <Controls /> */}
          </ReactFlow>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default Flow;
