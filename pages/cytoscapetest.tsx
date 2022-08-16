import { useRef, useEffect } from "react";
import React from "react";
import cytoscape from "cytoscape";

const CytoscapeTest: React.FC = () => {
  const cytoEl = useRef(null);

  useEffect(() => {
    cytoscape({
      container: cytoEl.current,
      elements: [
        // list of graph elements to start with
        {
          // node a
          data: { id: "a" },
        },
        {
          // node b
          data: { id: "b" },
        },
        {
          // node b
          data: { id: "c" },
        },
        {
          // node b
          data: { id: "d" },
        },
        {
          // edge ab
          data: { id: "ab", source: "a", target: "b" },
        },
        {
          // edge ab
          data: { id: "ac", source: "a", target: "c" },
        },
        {
          // edge ab
          data: { id: "bc", source: "b", target: "c" },
        },
      ],

      style: [
        // the stylesheet for the graph
        {
          selector: "node",
          style: {
            "background-color": "#666",
            label: "data(id)",
          },
        },

        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#ccc",
            "target-arrow-color": "#ccc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
      ],

      layout: {
        name: "grid",
        rows: 3,
      },
    });
  }, [cytoEl]);

  return (
    <>
      <h1>CytoScape test</h1>
      <div
        ref={cytoEl}
        style={{ background: "ivory", width: "100%", height: "80vh" }}
      />
    </>
  );
};

export default CytoscapeTest;
