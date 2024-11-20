import React, { useState } from "react";
import { Node, applyNodeChanges } from "@xyflow/react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";


import TitleNodeForm from "../nodes/forms/TitleNodeForm";
import LocationTriggerForm from "../triggers/LocationTriggerForm";

type NodePanelProps = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

const NodePanel: React.FC<NodePanelProps> = ({ nodes, setNodes }) => {
  const [nodeId, setNodeId] = useState<string>("");
  const [nodeType, setNodeType] = useState<string>("");
  const [triggerType, setTriggerType] = useState<string>("");
  const [state, setState] = useState({ nodeID: "", nodeType: "", triggerType: "" });
  const [nodeData, setNodeData] = useState<any>({});



  const addNode = () => {

   if (!nodeId || !nodeType || !triggerType) {
      alert("Please fill all fields: Node ID, Node Type, and Trigger Type.");
      return;
    }

    if (nodes && nodes.find((node) => node.id === nodeId)) {
      alert("Node ID must be unique.");
      return;
    }

    const newNode: Node = {
      id: nodeId,
      position: { x: 0, y: 0 }, // Random starting position
      data: { nodeType, triggerType, ...nodeData },
      draggable: true,
      selectable: true,
    };

    setNodes((nodes) => nodes.concat(newNode));

    setNodeId(""); // Reset form inputs
    setNodeType("");
    setTriggerType("");

    //setIsDialogOpen(true);  // Open dialog to configure the node
  };

  //"SUBTITLE", "TITLE", "TITLE_SUBTITLE", "CHAT", "DISPLAY", "ACTION_BAR", "BOSS_BAR", "CHOICE", "INPUT"
  const renderNodeForm = () => {
    if (nodeType === "TITLE") {
      return <TitleNodeForm nodeData={nodeData} setNodeData={setNodeData} />;
    }

    // Add more node type conditions if needed

    return null;
  };

  const renderTriggerForm = () => {
    if (triggerType === "LOCATION") {
      return <LocationTriggerForm nodeData={nodeData} setNodeData={setNodeData} />;
    }

    // Add more trigger type conditions if needed

    return null;
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Node ID Input */}
        <div>
          <label className="text-white block">Node ID</label>
          <input
            type="text"
            className="border border-gray-300 rounded p-2 w-full"
            value={nodeId}
            onChange={(e) => setNodeId(e.target.value)}
            placeholder="Enter Node ID"
          />
        </div>

        {/* Node Type Selection */}
        <div>
          <label className="text-white block">Node Type</label>
          <select
            className="border border-gray-300 rounded p-2 w-full"
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
          >
            <option value="">Select Node Type</option>
            {["SUBTITLE", "TITLE", "TITLE_SUBTITLE", "CHAT", "DISPLAY", "ACTION_BAR", "BOSS_BAR", "CHOICE", "INPUT"].map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Trigger Type Selection */}
        <div>
          <label className="text-white block">Trigger Type</label>
          <select
            className="border border-gray-300 rounded p-2 w-full"
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value)}
          >
            <option value="">Select Trigger Type</option>
            {["LOCATION", "INTERACT", "ENTITY", "BLOCK", "ELIMINATE", "ITEM", "TIME", "COMMAND"].map((trigger) => (
              <option key={trigger} value={trigger}>{trigger}</option>
            ))}
          </select>
        </div>

        {/* Add Node Button */}
        <button
          onClick={addNode}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition"
        >
          Add Node
        </button>
      </div>
    </div>
  );
};

export default NodePanel;
