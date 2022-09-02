import ELK from "elkjs";

const cleanELKNodes = (nodesList) =>
  nodesList.map((node) => ({
    id: node.id,
    data: node.data,
    position: {
      x: node.x,
      y: node.y,
    },
  }));

const exampleGraph = {
  id: "root",
  layoutOptions: { "elk.algorithm": "layered" },
  children: [
    { id: "n1", label: "elk1", width: 200, height: 100 },
    { id: "n2", label: "elk2", width: 200, height: 100 },
    { id: "n3", label: "elk3", width: 200, height: 100 },
  ],
  edges: [
    { id: "e1", source: "n1", target: "n2" },
    { id: "e2", source: "n1", target: "n3" },
  ],
};

const handler = async (req, res) => {
  const flowData = JSON.parse(req.query.flow);
  const nodes = flowData.nodes;
  if (!Array.isArray(nodes)) throw new Error('Nodes must exist on flow data');
  const cleanedNodes = nodes.map((datum) => ({
    ...datum,
    width: 200,
    height: 100,
  }));

  const elk = new ELK();
  const graph = {
    id: "root",
    layoutOptions: { "elk.algorithm": "layered", "elk.direction": "DOWN" },
    children: cleanedNodes,
    edges: flowData.edges,
  };

  const layout = await elk.layout(graph);

  const returnData = {
    nodes: [...cleanELKNodes(layout.children)],
    edges: layout.edges,
  };
  return res.send(returnData);
};

export default handler;
