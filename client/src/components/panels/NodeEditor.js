"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEditor = void 0;
const react_1 = require("react");
require("reactflow/dist/style.css");
const ConversationPanel_1 = __importDefault(require("../editor/ConversationPanel"));
const EditorPanel_1 = __importDefault(require("../editor/EditorPanel"));
const EditorPanel_2 = require("../editor/EditorPanel");
const defaultConversationData = {
    startSound: false,
    endSound: false,
    startMessage: false,
    endMessage: false,
    blocking: true,
    citizens: false,
    conversationName: "",
    nodeId: "",
};
const NodeEditor = () => {
    const [conversationData, setConversationData] = (0, react_1.useState)(defaultConversationData);
    const handleInputChange = (key, value) => {
        setConversationData((prevData) => (Object.assign(Object.assign({}, prevData), { [key]: value })));
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
            nodes: EditorPanel_2.nodesObject
        };
        const json = JSON.stringify(output, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${conversationData.conversationName || "conversation"}.json`;
        link.click();
    };
    return (<div className="flex flex-row gap-12 justify-evenly">
      <ConversationPanel_1.default conversationData={conversationData} handleInputChange={handleInputChange} exportJson={exportJson}/>
      <EditorPanel_1.default />
    </div>);
};
exports.NodeEditor = NodeEditor;
exports.default = exports.NodeEditor;
