import React from "react";
import { ConversationData } from "../types/ConversationType";

type ConversationPanelProps = {
  conversationData: ConversationData;
  handleInputChange: (key: keyof ConversationData, value: string | boolean) => void;
  exportJson: () => void;
};

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  conversationData,
  handleInputChange,
  exportJson,
}) => {
  return (
    <div className="w-[250px] bg-slate-800 p-5 rounded-lg flex flex-col justify-stretch">
      <div className="flex flex-col justify-stretch gap-52">
        <div>
          <h1 className="text-white font-bold text-xl pb-5">Conversation</h1>
          <div className="space-y-4">
            <div>
              <label className="text-white block">Conversation Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2 w-full"
                value={conversationData.conversationName}
                onChange={(e) =>
                  handleInputChange("conversationName", e.target.value)
                }
                placeholder="Enter conversation name"
              />
            </div>
            <div>
              <label className="text-white block">Start Node</label>
              <input
                type="text"
                className="border border-gray-300 rounded p-2 w-full"
                value={conversationData.nodeId}
                onChange={(e) => handleInputChange("nodeId", e.target.value)}
                placeholder="Enter start node ID"
              />
            </div>
            <div className="space-y-2">
              <label className="text-white block">Conversation Settings</label>
              {[
                { label: "Start Sound", key: "startSound" },
                { label: "End Sound", key: "endSound" },
                { label: "Start Message", key: "startMessage" },
                { label: "End Message", key: "endMessage" },
                { label: "Blocking", key: "blocking" },
                { label: "Citizens", key: "citizens" },
              ].map(({ label, key }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={conversationData[key as keyof ConversationData] as boolean}
                    onChange={(e) =>
                      handleInputChange(key as keyof ConversationData, e.target.checked)
                    }
                  />
                  <label className="text-white">{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-x-2 flex justify-center">
          <button
            onClick={exportJson}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
