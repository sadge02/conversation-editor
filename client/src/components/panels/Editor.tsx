import React, { useState, useCallback, useMemo } from "react";
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from "@xyflow/react";
import { Button } from "../ui/button";
import { Select, SelectTrigger, SelectGroup, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Input } from "../ui/input";
import { toast } from "sonner";

import "@xyflow/react/dist/style.css";

const nodesObject = {};

const initialNodes = [];
const initialEdges = [];

const CustomNode = ({ data, isSelected }) => {
  return (
    <div
      style={{
        border: isSelected ? "2px solid #007BFF" : "2px solid #333",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: isSelected ? "#e3e3e3" : "#f0f0f0",
        minWidth: "150px",
        textAlign: "center",
      }}
    >
      <strong>{data.nodeID}</strong>
      <br />
      {data.nodeType} Node
      <br />
      {data.nodeTrigger} Trigger
    </div>
  );
};

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeData, setNodeData] = useState({
    nodeID: "",
    nodeType: "",
    nodeTrigger: "",
  });
  const [selectedNodeId, setSelectedNodeId] = useState(null); // Tracks the selected node ID
  const [editedJson, setEditedJson] = useState(""); // Tracks the editable JSON

  const updateNodeData = (key, value) => {
    setNodeData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onAdd = useCallback(() => {
    const { nodeID, nodeType, nodeTrigger } = nodeData;

    if (!nodeID) {
      toast("Please provide a valid Node ID");
      return;
    }

    if (nodesObject[nodeID]) {
      toast("Node ID already exists");
      return;
    }

    if (!nodeType) {
      toast("Please select a Node Type");
      return;
    }

    if (!nodeTrigger) {
      toast("Please select a Trigger Type");
      return;
    }

    const nodeObject = {
      [nodeID]: {
        node_type: nodeType,
        node_settings: {},
        next_node: "",
        trigger: {
          trigger_type: nodeTrigger,
        },
        requirements: [],
        commands: [],
      },
    };

    nodesObject[nodeID] = nodeObject[nodeID];

    const newNode = {
      id: nodeID,
      type: "customNode",
      data: { ...nodeData, label: nodeID },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [nodeData, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id); // Set the selected node ID
    if (nodesObject[node.id]) {
      setEditedJson(JSON.stringify(nodesObject[node.id], null, 2)); // Load JSON for editing
    }
  }, []);

  const handleSave = () => {
    if (window.confirm("Are you sure you want to save changes to this node?")) {
      try {
        const parsedJson = JSON.parse(editedJson); // Validate JSON
        nodesObject[selectedNodeId] = parsedJson; // Update the node object
        toast.success("Node updated successfully");
      } catch (error) {
        toast.error("Invalid JSON format");
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this node?")) {
      const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
      setNodes(updatedNodes); // Remove node from canvas
      delete nodesObject[selectedNodeId]; // Remove node from the nodesObject
      setSelectedNodeId(null); // Clear selection
      setEditedJson(""); // Clear the JSON editor
      toast.success("Node deleted successfully");
    }
  };

  const nodeTypes = useMemo(
    () => ({
      customNode: (props) => (
        <CustomNode {...props} isSelected={props.id === selectedNodeId} />
      ),
    }),
    [selectedNodeId]
  );

  return (
    <div className="flex flex-row gap-12">
      <div className="w-[1080px] h-[720px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick} // Handle node clicks
          fitView
          fitViewOptions={{ padding: 2 }}
          style={{ backgroundColor: "#F7F9FB" }}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Panel position="top-center" className="flex flex-row gap-5">
            <Input
              type="text"
              id="nodeID"
              placeholder="Node ID"
              className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition"
              onChange={(e) => updateNodeData("nodeID", e.target.value)}
              value={nodeData.nodeID}
            />
            <Select onValueChange={(value) => updateNodeData("nodeType", value)}>
              <SelectTrigger id="nodeType" className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition">
                <SelectValue placeholder="Node Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="TITLE">Title Node</SelectItem>
                  <SelectItem value="SUBTITLE">Subtitle Node</SelectItem>
                  <SelectItem value="INPUT">Input Node</SelectItem>
                  <SelectItem value="CHOICE">Choice Node</SelectItem>
                  <SelectItem value="DISPLAY">Display Node</SelectItem>
                  <SelectItem value="CHAT">Chat Node</SelectItem>
                  <SelectItem value="BOSS_BAR">Boss Bar Node</SelectItem>
                  <SelectItem value="ACTION_BAR">Action Bar Node</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => updateNodeData("nodeTrigger", value)}>
              <SelectTrigger id="triggerType" className="w-[175px] h-[40px] bg-black text-white border-black active:scale-95 transition">
                <SelectValue placeholder="Trigger Type" id="triggerType" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="BLOCK">Block Trigger</SelectItem>
                  <SelectItem value="ITEM">Item Trigger</SelectItem>
                  <SelectItem value="COMMAND">Command Trigger</SelectItem>
                  <SelectItem value="LOCATION">Location Trigger</SelectItem>
                  <SelectItem value="ENTITY">Entity Trigger</SelectItem>
                  <SelectItem value="ELIMINATE">Eliminate Trigger</SelectItem>
                  <SelectItem value="TIME">Time Trigger</SelectItem>
                  <SelectItem value="INTERACT">Interact Trigger</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button className="w-[100px] h-[40px] bg-black text-white border-black active:scale-95 transition" variant="outline" onClick={onAdd}>
              Create Node
            </Button>
          </Panel>
        </ReactFlow>
      </div>
      <div className="w-[400px] bg-gray-800 text-white p-4 rounded-lg">
        <h1 className="text-lg font-bold mb-4">Node Details</h1>
        {selectedNodeId && nodesObject[selectedNodeId] ? (
          <>
            <textarea
              className="w-full h-[300px] bg-gray-700 text-white p-2 rounded"
              value={editedJson}
              onChange={(e) => setEditedJson(e.target.value)}
              spellCheck="false"
            />
            <Button
              className="w-full mt-4 bg-blue-600 text-white p-2 rounded active:scale-95"
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              className="w-full mt-2 bg-red-600 text-white p-2 rounded active:scale-95"
              onClick={handleDelete}
            >
              Delete Node
            </Button>
          </>
        ) : (
          <p>No node selected</p>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <SaveRestore />
  </ReactFlowProvider>
);
