import React from "react";
import { Handle } from "@xyflow/react";

// Define the custom node component
const CustomNode = ({ data, id }: { data: any; id: string }) => {
if (!id) {
    console.error("Node ID is missing. Ensure all nodes have an 'id' property.");
    return null;
    }
  return (
    <div style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8, background: "#fff" }}>
      <div><strong>Node ID:</strong> {data.nodeId || "N/A"}</div>
      <div><strong>Node Type:</strong> {data.nodeType || "N/A"}</div>
      <div><strong>Trigger Type:</strong> {data.triggerType || "N/A"}</div>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

export default CustomNode;