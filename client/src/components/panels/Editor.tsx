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
import {NodeType} from "../types/NodeType";

import "@xyflow/react/dist/style.css";
import { AlignRight } from "lucide-react";
import { get } from "http";
import { GetCommands, GetTrigger, GetNode } from "../objects/JsonObjects";

const nodesObject = {};

const initialNodes: any[] = [];
const initialEdges: any[] = [];





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
    (params) => {
      setEdges((eds) => addEdge(params, eds));
  
      // Extract the source and target node IDs from the connection params
      const { source, target, sourceHandle } = params;
  
      if (!source || !target) return;
  
      // Update the nextNode field in the source node's settings
      if (nodesObject[source]) {
        if (nodesObject[source].node_type === "CHOICE" && sourceHandle) {
          // If the node type is CHOICE, determine the choice index from the source handle ID
          const choiceIndex = parseInt(sourceHandle.split('-').pop(), 10); // Get the index from the handle ID
          if (!isNaN(choiceIndex)) {
            nodesObject[source].node_settings.choices[choiceIndex].node = target;
          }
        } else {
          // For other nodes, update the nextNode directly
          nodesObject[source].next_node = target;
        }
      }
  
      // Optionally notify the user of the connection
      toast.success(`Connected ${source} to ${target}`);
    },
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
        node_settings: GetNode(nodeType, numChoices),
        next_node: "",
        trigger: GetTrigger(nodeTrigger),
        requirements: [],
        commands: GetCommands(numCommands),
      },
    };

    nodesObject[nodeID] = nodeObject[nodeID];

    const newNode = {
      id: nodeID,
      type: "NodeType",
      data: { ...nodeData, label: nodeID },
      position: {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
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
    if (!selectedNodeId) return;
  
    // Remove the node from the nodes array
    const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
    setNodes(updatedNodes);
  
    // Clear references to the deleted node in other nodes
    Object.keys(nodesObject).forEach((nodeId) => {
      if (nodesObject[nodeId].next_node === selectedNodeId) {
        nodesObject[nodeId].next_node = "";
      }
  
      if (nodesObject[nodeId].node_type === "CHOICE") {
        nodesObject[nodeId].node_settings.choices.forEach((choice) => {
          if (choice.node === selectedNodeId) {
            choice.node = "";
          }
        });
      }
    });
  
    // Delete the node from the `nodesObject`
    delete nodesObject[selectedNodeId];
  
    // Remove all edges connected to the deleted node
    const updatedEdges = edges.filter(
      (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
    );
    setEdges(updatedEdges);
  
    // Reset the selected node
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
