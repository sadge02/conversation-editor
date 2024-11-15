import { useState } from "react";
import "reactflow/dist/style.css";
import ConversationPanel from "../editor/ConversationPanel";
import Editor from "../editor/EditorPanel";
import { ConversationData } from "../types/ConversationType";
import { nodesObject } from "../editor/EditorPanel";

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

export const NodeEditor = () => {
  const [conversationData, setConversationData] = useState<ConversationData>(
    defaultConversationData
  );

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
      nodes: nodesObject
    };
  
    const json = JSON.stringify(output, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${conversationData.conversationName || "conversation"}.json`;
    link.click();
  };

  return (
    <div className="flex flex-row gap-5 justify-evenly">
      <Editor />
      <ConversationPanel
        conversationData={conversationData}
        handleInputChange={handleInputChange}
        exportJson={exportJson}
      />
    </div>
  );
};

export default NodeEditor;