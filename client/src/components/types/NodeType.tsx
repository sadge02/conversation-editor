import { useEffect } from "react";
import {
  Handle,
  Position,
  useUpdateNodeInternals
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";


export const NodeType = ({ data, isSelected }: { data: any; isSelected: boolean }) => {

  const updateNodeInternals = useUpdateNodeInternals();
  useEffect(() => {
    setTimeout(() => {
      updateNodeInternals(data.nodeID);
    }, 0);
  }, [data.nodeID, updateNodeInternals, data, isSelected]);

  return (
    <div
      id={data.nodeID}
      style={{
        border: isSelected ? "2px solid #007BFF" : "2px solid #333",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: isSelected ? "#D8EAFE" : "#f0f0f0",
        textAlign: "center",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        isConnectable={true}
        isConnectableEnd={true}
        isConnectableStart={false}
        position={Position.Top}
        style={{ background: "#128011" }}
      />
      <strong>{data.nodeID}</strong>
      <br />
      {data.nodeType} Node
      <br />
      {data.nodeTrigger} Trigger
      {data.nodeType === "CHOICE" &&
        Array.from({ length: data.numChoices }, (_, index) => (
          <Handle
            id={`${data.nodeID}-${index}`}
            key={index}
            type="source"
            isConnectable={true}
            isConnectableEnd={false}
            isConnectableStart={true}
            position={Position.Bottom}
            style={{
              left: ((document.getElementById(data.nodeID)?.offsetWidth ?? 0) / (data.numChoices + 1)) * (index + 1),
              background: "#f54251",
              position: "absolute",
            }}
          />
        ))}
      {data.nodeType !== "CHOICE" && (
        <Handle
          id={`${data.nodeID}-0`}
          key={0}
          type="source"
          isConnectable={true}
          isConnectableEnd={false}
          isConnectableStart={true}
          position={Position.Bottom}
          style={{ background: "#f54251" }}
        />
      )}
    </div>
  );
};