import React, { memo } from "react";
import NestedNode from "./ChildNode";

import { Handle, Position } from "react-flow-renderer";

export default memo(function MemoComponent({
  data,
  isConnectable,
}: {
  data;
  isConnectable;
}) {
  console.log({ data });
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
        onConnect={(params) => console.log("handle onConnect", params)}
        isConnectable={isConnectable}
      />
      <div
        style={{
          border: "2px solid purple",
          padding: "10px",
          background: "tomato",
          width: data.width ? `${data.width}px` : "150px",
          height: data.height ? `${data.height}px` : "50px",
        }}
      >
        {data.label}
        <strong>{data.color}</strong>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        style={{ bottom: 0, background: "#555" }}
        isConnectable={isConnectable}
      />
    </>
  );
});
