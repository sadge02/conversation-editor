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

const nodesObject = {};

const initialNodes: any[] = [];
const initialEdges: any[] = [];

const NodeType = ({ data, isSelected }: { data: any; isSelected: boolean }) => {

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

const SaveRestore = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [nodeData, setNodeData] = useState({
    nodeID: "",
    nodeType: "",
    nodeTrigger: "",
    numChoices: 0,
    numCommands: 0,
  });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [editedJson, setEditedJson] = useState("");


  const updateNodeData = (key: string, value: string | number) => {
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
    const { nodeID, nodeType, nodeTrigger, numChoices, numCommands } = nodeData;

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

    if (numChoices < 0) {
      toast("Please provide a valid number of choices");
      return;
    }

    if (numCommands < 0) {
      toast("Please provide a valid number of commands");
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
        commands: Array(numCommands).fill(""),
      },
    };

    nodesObject[nodeID] = nodeObject[nodeID];

    const newNode = {
      id: nodeID,
      type: "NodeType",
      data: { ...nodeData, label: nodeID },
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [nodeData, setNodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    if (nodesObject[node.id]) {
      setEditedJson(JSON.stringify(nodesObject[node.id], null, 2));
    }
  }, []);

  const handleSave = () => {
    try {
      const parsedJson = JSON.parse(editedJson);
      nodesObject[selectedNodeId] = parsedJson;
      toast.success("Node updated successfully");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleDelete = () => {
    const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
    setNodes(updatedNodes);
    delete nodesObject[selectedNodeId];
    setSelectedNodeId(null);
    setEditedJson("");
    toast.success("Node deleted successfully");
  };

  const nodeTypes = useMemo(
    () => ({
      NodeType: (props) => (
        <NodeType {...props} isSelected={props.id === selectedNodeId} />
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
          onNodeClick={onNodeClick}
          fitView
          fitViewOptions={{ padding: 2 }}
          style={{ backgroundColor: "#F7F9FB" }}
          nodeTypes={nodeTypes}
        >
          <Background />
          <Panel position="left-bottom" className="flex flex-row justify-end gap-5">
            <div className="bg-slate-900 w-[315px] p-5 rounded-lg flex flex-col gap-2">
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label >Node ID</label>
                </div>
                <Input
                  type="text"
                  id="nodeID"
                  placeholder="Node ID"
                  className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition"
                  onChange={(e) => updateNodeData("nodeID", e.target.value)}
                  value={nodeData.nodeID}
                />
              </div>
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>Node Type</label>
                </div>
                <Select onValueChange={(value) => updateNodeData("nodeType", value)}>
                  <SelectTrigger id="nodeType" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition">
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
              </div>
              {nodeData.nodeType === "CHOICE" && (
                <div className="flex flex-row text-white justify-between align-middle font-bold">
                  <div className="flex items-center justify-center">
                    <label>No. Choices</label>
                  </div>
                  <Input
                    type="number"
                    id="numChoices"
                    placeholder="Choices"
                    className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition"
                    onChange={(e) => updateNodeData("numChoices", parseInt(e.target.value))}
                    value={nodeData.numChoices}
                  />
                </div>
              )}
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>Trigger Type</label>
                </div>
                <Select onValueChange={(value) => updateNodeData("nodeTrigger", value)}>
                  <SelectTrigger id="triggerType" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition">
                    <SelectValue placeholder="Trigger Type" />
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
              </div>
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>No. Commands</label>
                </div>
                <Input
                  type="number"
                  id="numCommands"
                  placeholder="Commands"
                  className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition"
                  onChange={(e) => updateNodeData("numCommands", parseInt(e.target.value))}
                  value={nodeData.numCommands}
                />
              </div>
              <div className="flex items-center justify-end pt-5">
                <Button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0 hover:text-white"
                  variant="outline"
                  onClick={onAdd}
                >
                  Create Node
                </Button>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      <div className="w-[350px] bg-slate-900 shadow-md rounded-md">
        <h2 className="font-bold text-xl mb-4 text-white">Node Details</h2>
        {selectedNodeId ? (
          <>
            <textarea
              className="w-full h-[550px] p-2 border border-gray-300 rounded-md mb-4 bg-slate-100"
              value={editedJson}
              onChange={(e) => setEditedJson(e.target.value)}
              spellCheck={false}
            />
            <div className="flex gap-2">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="outline" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0">
                    Save Changes
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to save changes to this node?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button variant="outline" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0">
                    Delete Node
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this node? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        ) : (
          <p className="text-white">No node selected</p>
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
