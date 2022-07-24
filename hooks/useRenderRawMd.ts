import { useEffect, useState } from "react";
import { rawMdToFlatData, flatDataToMetaGraph } from "../common/utils";

export default function useRenderRawMd(rawMd?: any) {
  const [result, setResult] = useState({});

  useEffect(() => {
    const flatData = rawMdToFlatData(rawMd);
    setResult(flatDataToMetaGraph(flatData));
  }, [rawMd]);

  return [result, setResult];
}
