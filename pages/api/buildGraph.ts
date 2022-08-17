import ELK from "elkjs";

const handler = async (req, res) => {
  const elk = new ELK();
  const graph = {
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
  const layout = await elk.layout(graph);
  const cleanELKNodes = (nodesList) =>
    nodesList.map((node) => ({
      id: node.id,
      data: {
        label: node.label,
      },
      position: {
        x: node.x,
        y: node.y,
      },
    }));
  const returnData = {
    nodes: cleanELKNodes(layout.children),
    edges: layout.edges,
  };
  return res.send(returnData);
};

export default handler;
