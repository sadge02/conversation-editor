import { useEffect, useState, useCallback, useMemo } from "react";
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
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { toast } from "sonner";
import { NodeType } from "../types/NodeType";
import { GetCommands, GetTrigger, GetNode } from "../objects/JsonObjects";
import ConversationPanel from "./ConversationPanel";
import { ConversationData } from "../types/ConversationType";

import "@xyflow/react/dist/style.css";

export type ConversationPanelProps = {
  conversationData: ConversationData;
  handleInputChange: (key: keyof ConversationData, value: string | boolean) => void;
  exportJson: () => void;
  importJson?: (file: File) => void;
};

export const nodesObject: { [key: string]: any } = JSON.parse(
  localStorage.getItem("nodesObject") || "{}"
);

const Editor: React.FC<ConversationPanelProps> = ({
  conversationData,
  handleInputChange,
  exportJson,
  initialNodes,
  initialEdges,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges.map((edge: any) => ({ ...edge, animated: true }))
  );
  const [selectedEdge, setSelectedEdge] = useState<{ id: string; source: string; target: string } | null>(null);
  const [nodeData, setNodeData] = useState({
    nodeID: "",
    nodeType: "",
    nodeTrigger: "",
    numChoices: 0,
    numCommands: 0,
  });
  const [selectedNodeId, setSelectedNodeId] = useState<string | number | null>(null);
  const [editedJson, setEditedJson] = useState("");

  useEffect(() => {
    localStorage.setItem("nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("edges", JSON.stringify(edges));
  }, [edges]);

  useEffect(() => {
    localStorage.setItem("nodesObject", JSON.stringify(nodesObject));
  }, [nodes]);

  const handleDeleteAll = () => {
    setNodes([]);
    setEdges([]);
    Object.keys(nodesObject).forEach((key) => delete nodesObject[key]);

    localStorage.removeItem("nodes");
    localStorage.removeItem("edges");
    localStorage.removeItem("nodesObject");

    toast.success("All nodes, edges, and node objects have been deleted.");
  };

  const updateNodeData = (key: string, value: string | number) => {
    setNodeData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const onConnect = useCallback(
    (params: { source: any; target: any; sourceHandle: any }) => {
      setEdges((eds) => addEdge({ id: `${params.source}-${params.target}`, ...params, animated: true }, eds));

      const { source, target, sourceHandle } = params;

      if (!source || !target) return;

      if (nodesObject[source]) {
        if (nodesObject[source].node_type === "CHOICE" && sourceHandle) {
          const choiceIndex = parseInt(sourceHandle.split("-").pop(), 10);
          if (!isNaN(choiceIndex)) {
            nodesObject[source].node_settings.choices[choiceIndex].node = target;
          }
        } else {
          nodesObject[source].next_node = target;
        }
      }
      toast.success(`Connected ${source} to ${target}`);
    },
    [setEdges]
  );

  const handleEdgeClick = (event: any, edge: any) => {
    event.stopPropagation();
    setSelectedEdge(edge);
  };

  const handleRemoveSelectedEdge = () => {
    if (!selectedEdge) {
      toast.error("No edge selected");
      return;
    }

    const { source, target } = selectedEdge;

    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.id !== selectedEdge.id)
    );

    if (nodesObject[source]?.next_node === target) {
      nodesObject[source].next_node = "";
    }

    if (nodesObject[source]?.node_type === "CHOICE") {
      nodesObject[source].node_settings.choices.forEach((choice: { node: string }) => {
        if (choice.node === target) {
          choice.node = "";
        }
      });
    }

    setSelectedEdge(null);
    toast.success(`Removed edge from ${source} to ${target}`);
  };

  const onAdd = useCallback(() => {
    const { nodeID, nodeType, nodeTrigger, numChoices, numCommands } = nodeData;

    if (!nodeID) {
      toast("Please provide a valid Node ID");
      return;
    }

    if (!nodeType || !nodeTrigger) {
      toast("Please select a valid Node Type and Trigger Type");
      return
    }

    if (nodeID.includes(" ")) {
      toast("Node ID cannot contain empty spaces");
      return;
    }

    if (nodesObject[nodeID]) {
      toast("Node ID already exists");
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

  const onNodeClick = useCallback((_event: any, node: { id: string | number; }) => {
    setSelectedNodeId(node.id);
    if (nodesObject[node.id]) {
      setEditedJson(JSON.stringify(nodesObject[node.id], null, 2));
    }
  }, []);

  const handleDelete = () => {
    if (!selectedNodeId) return;

    const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
    setNodes(updatedNodes);

    Object.keys(nodesObject).forEach((nodeId) => {
      if (nodesObject[nodeId].next_node === selectedNodeId) {
        nodesObject[nodeId].next_node = "";
      }

      if (nodesObject[nodeId].node_type === "CHOICE") {
        nodesObject[nodeId].node_settings.choices.forEach((choice: { node: string; }) => {
          if (choice.node === selectedNodeId) {
            choice.node = "";
          }
        });
      }
    });

    delete nodesObject[selectedNodeId];

    const updatedEdges = edges.filter(
      (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId
    );
    setEdges(updatedEdges);

    setSelectedNodeId(null);
    setEditedJson("");

    toast.success("Node deleted successfully");
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);

        if (!data.start_node || !data.players || !data.nodes || !data.settings) {
          throw new Error("Invalid JSON structure.");
        }

        let importedNodes = data.nodes || [];
        const newNodes = []
        const newEdges = []

        for (const nodeID in nodesObject) {
          delete nodesObject[nodeID];
        }

        for (const nodeID in importedNodes) {

          nodesObject[nodeID] = importedNodes[nodeID];

          if (importedNodes[nodeID].node_type === "CHOICE") {

            const nodeData = {
              nodeID: nodeID,
              nodeType: importedNodes[nodeID].node_type,
              nodeTrigger: importedNodes[nodeID].trigger.trigger_type,
              numChoices: importedNodes[nodeID].node_settings.choices.length,
              numCommands: importedNodes[nodeID].commands.length
            };
            newNodes.push({
              id: nodeID,
              type: "NodeType",
              data: { ...nodeData, label: nodeID },
              position: {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
              },
            });
            let index = 0;
            importedNodes[nodeID].node_settings.choices.forEach((choice: { node: string }) => {
              newEdges.push({
                id: `${nodeID}-${choice.node}`,
                source: nodeID,
                sourceHandle: `${index}`,
                target: choice.node,
                animated: true,
              });
              index++;
            });
          } else {
            const nodeData = {
              nodeID: nodeID,
              nodeType: importedNodes[nodeID].node_type,
              nodeTrigger: importedNodes[nodeID].trigger.trigger_type,
              numChoices: 0,
              numCommands: importedNodes[nodeID].commands.length
            };
            newNodes.push({
              id: nodeID,
              type: "NodeType",
              data: { ...nodeData, label: nodeID },
              position: {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
              },
            });
            newEdges.push({
              id: `${nodeID}-${importedNodes[nodeID].next_node}`,
              source: nodeID,
              target: importedNodes[nodeID].next_node,
              animated: true,
            });
          }
        }

        setNodes(newNodes);
        setEdges(newEdges);

        toast("JSON Imported Successfully!");
      } catch (e) {
        toast("Failed to import JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (!selectedNodeId || !nodesObject[selectedNodeId]) {
      toast.error("No node selected or node does not exist");
      return;
    }

    const node = nodesObject[selectedNodeId];
    const resetNode = {
      node_type: node.node_type,
      node_settings: GetNode(node.node_type, node.node_settings?.choices?.length || 0),
      next_node: "",
      trigger: GetTrigger(node.trigger?.trigger_type || ""),
      requirements: [],
      commands: GetCommands(node.commands?.length || 0),
    };

    nodesObject[selectedNodeId] = resetNode;
    setEditedJson(JSON.stringify(resetNode, null, 2));

    const newEdges = edges.filter((edge) => {
      return edge.source !== selectedNodeId;
    });

    setEdges(newEdges);

    toast.success("Node reset successfully");
  };

  const nodeTypes = useMemo(
    () => ({
      NodeType: (props: any) => (
        <NodeType {...props} isSelected={props.id === selectedNodeId} />
      ),
    }),
    [selectedNodeId]
  );

  return (
    <ReactFlowProvider>
      <div className="flex flex-row gap-5">
        <div className="w-[350px] bg-slate-800 shadow-md rounded-lg p-5">
          <h2 className="font-bold text-xl mb-4 text-white">Node Details</h2>
          {selectedNodeId ? (
            <>
              <textarea
                className="w-full h-[550px] p-2 border border-gray-300 rounded-md mb-4 bg-slate-100"
                value={editedJson}
                onChange={(e) => {
                  setEditedJson(e.target.value);

                  try {
                    const parsedJson = JSON.parse(e.target.value);
                    if (selectedNodeId !== null) {
                      nodesObject[selectedNodeId] = parsedJson;
                    } else {
                      toast.error("No node selected");
                    }
                  } catch {
                    toast.error("Invalid JSON format");
                  }
                }}
                spellCheck={false}
              />

              <div className="flex gap-2 justify-evenly">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="outline"
                      className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0 hover:text-white"
                      disabled={!selectedEdge}
                    >
                      Remove Edge
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to save delete this edge? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRemoveSelectedEdge}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="outline"
                      className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0"
                    >
                      Reset Node
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Reset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reset this node?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button
                      variant="outline"
                      className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0"
                    >
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
        <div className="w-[1080px] h-[720px]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={handleEdgeClick}
            fitView
            fitViewOptions={{ padding: 2 }}
            style={{ backgroundColor: "#F7F9FB" }}
            nodeTypes={nodeTypes}
          >
            <Background />
            <Panel position="bottom-left" className="flex flex-row justify-end gap-5">
              <div className="bg-slate-900 w-[315px] p-5 rounded-lg flex flex-col gap-2">
                <div className="flex flex-row text-white justify-between align-middle font-bold">
                  <div className="flex items-center justify-center">
                    <label >Node ID</label>
                  </div>
                  <Input
                    type="text"
                    id="nodeID"
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
                      <SelectValue />
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
                        <SelectItem value="TITLE_SUBTITLE">Title Subtitle Node</SelectItem>
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
                      <SelectValue />
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
                <div className="flex items-center justify-between pt-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-[75px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:scale-95 transition">
                        Delete All
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete all nodes, edges, and node objects? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAll}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button
                    className="w-[150px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0 hover:text-white"
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
      </div>
      <ConversationPanel
        conversationData={conversationData}
        handleInputChange={handleInputChange}
        exportJson={exportJson}
        importJson={importJson}
      />
    </ReactFlowProvider>
  );
};

export default Editor;
