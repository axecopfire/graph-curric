import { useState, useEffect } from "react";
import { rawMdToFlow, renderRawMd } from "../common/commonBrowserUtils";

export default function useHandleMd() {
  const [md, setMd] = useState({
    md: {},
    nodes: [],
    edges: [],
  });

  useEffect(() => {
    const getStaticMd = () =>
      fetch("/api/getStaticMd")
        .then((res) => res.json())
        .then((r) => {
          const rendered = renderRawMd(r);
          const { nodes, edges } = rawMdToFlow(rendered);

          return setMd({ md: rendered, nodes, edges });
        });
    getStaticMd();
  }, []);

  return { md, setMd };
}
