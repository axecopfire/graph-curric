import { useState, useEffect } from "react";
import { rawMdToFlow, renderRawMd } from "../common/commonBrowserUtils";

export default function useHandleMd() {
  const [md, setMd] = useState({
    md: {},
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const getStaticMd = async () => {
      const staticMd = await fetch(`/api/getStaticMd?fileList=[]`).then((r) =>
        r.json()
      );

      const rendered = renderRawMd(staticMd);
      const sanitizedFlow = rawMdToFlow(rendered);

      const graph = await fetch(
        `/api/buildGraph?flow=${JSON.stringify(sanitizedFlow)}`
      ).then((r) => r.json());
      console.log("hi");

      return setMd({ md: rendered, nodes: graph.nodes, edges: graph.edges });
    };
    getStaticMd();
  }, []);

  return { md, setMd };
}
