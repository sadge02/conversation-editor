import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Handle,
  Position,
  useUpdateNodeInternals
} from "@xyflow/react";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectGroup, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Input } from "../ui/input";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { toast } from "sonner";

import "@xyflow/react/dist/style.css";
import { AlignRight } from "lucide-react";
import { get } from "http";

export const NodeType = ({ data, isSelected }: { data: any; isSelected: boolean }) => {

    // To trigger React Flow to re-layout the node when we change its size or handles
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
          position: "relative", // Make the node container a positioned element
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
  
        {/* Render handles for CHOICE node */}
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
  
        {/* Default target handle for non-choice nodes */}
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