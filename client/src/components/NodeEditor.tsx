import React, { useCallback, useState } from "react";
import { ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, applyEdgeChanges, applyNodeChanges, Edge, addEdge } from "@xyflow/react";
import "reactflow/dist/style.css";
import ConversationPanel from "./editor/ConversationPanel";
import NodePanel from "./editor/NodePanel";

type ConversationData = {
  startSound: boolean;
  endSound: boolean;
  startMessage: boolean;
  endMessage: boolean;
  blocking: boolean;
  citizens: boolean;
  conversationName: string;
  nodeId: string;
};

const defaultConversationData: ConversationData = {
  startSound: false,
  endSound: false,
  startMessage: false,
  endMessage: false,
  blocking: true,
  citizens: false,
  conversationName: "",
  nodeId: "",
};

const nodeTypes = {};

const defaultNodeStyle = {
  border: "2px solid #ff0071",
  background: "white",
  borderRadius: 20
};

const initialNodes = [
];

const initialEdges: Edge[] = [];


export const NodeEditor = () => {
  const [conversationData, setConversationData] = useState<ConversationData>(
    defaultConversationData
  );
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onNodeAdd = ( {nodeID, nodeType, triggerType} ) => {
    setNodes((prevState) => {
      const nodeItem = {
        id: (Math.random() + 1).toString(36).substring(7),
        type: "custom",
        data: {
          label: nodeID,
          nodeType: nodeType,
          triggerType: triggerType
        },
        position: {
          x: Math.round(100 + Math.random() * (300 - 100)),
          y: 0
        },
        style: defaultNodeStyle
      };
      const nodes = [...prevState, nodeItem];
      return nodes;
    });
  };

  const handleInputChange = (
    key: keyof ConversationData,
    value: string | boolean
  ) => {
    setConversationData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const exportJson = () => {
    if (!conversationData.nodeId || !conversationData.conversationName) {
      alert("Please provide a Node ID and Conversation Name");
      return;
    }
  
    const output = {
      start_node: conversationData.nodeId,
      settings: {
        start_message: conversationData.startMessage,
        end_message: conversationData.endMessage,
        start_sound: conversationData.startSound,
        end_sound: conversationData.endSound,
        blocking: conversationData.blocking,
        citizens: conversationData.citizens,
      },
      players: {},
    };
  
    const json = JSON.stringify(output, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${conversationData.conversationName || "conversation"}.json`;
    link.click();
  };

  return (
    <div className="flex flex-row gap-12">
      <ConversationPanel
        conversationData={conversationData}
        handleInputChange={handleInputChange}
        exportJson={exportJson}
      />
      <div className="h-[720px] w-[1080px] border border-gray-300 rounded">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          minZoom={0.2}
          maxZoom={4}
          attributionPosition="bottom-left"
          nodeTypes={nodeTypes}
        >
          <Background color="#ccc" variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
        <NodePanel nodes={nodes} setNodes={onNodeAdd} />
    </div>
  );
};

export default NodeEditor;
