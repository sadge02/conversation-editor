import React, { useState } from "react";
import { ConversationData } from "../types/ConversationType";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { ConversationPanelProps } from "../editor/EditorPanel";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const ConversationPanel: React.FC<ConversationPanelProps> = ({
  conversationData,
  handleInputChange,
  exportJson,
  importJson,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile !== null) {
      if (importJson) {
        importJson(selectedFile);
      } else {
        toast("Import function is not available.");
      }
    } else {
      toast("Please select a file to import.");
    }
  };

  return (
    <div className="w-[250px] bg-slate-800 p-5 rounded-lg flex flex-col justify-stretch">
      <div className="flex flex-col justify-stretch gap-5">
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
                { label: "Add on Join", key: "addOnJoin" },
                { label: "Start on Join", key: "startOnJoin" },
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
        <div className="space-x-2 flex flex-col gap-2 justify-center align-middle">
          <div className="flex flex-col gap-7">
            <div>
              <Label htmlFor="picture" className="text-white">Upload Conversation</Label>
              <Input id="picture" type="file" accept=".json" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0" onChange={handleFileChange} />
            </div>
            <div className="flex flex-col gap-2 justify-center align-middle">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Button
                    variant="outline"
                    className="bg-blue-500 text-white text-base px-4 py-5 rounded hover:bg-blue-600 active:scale-95 transition w-full border-0"
                  >
                    Import
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Import</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to import a conversation? This will remove everything on canvas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleImport}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <button
                onClick={exportJson}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition w-full"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
