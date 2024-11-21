"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodesObject = void 0;
const react_1 = require("react");
const react_2 = require("@xyflow/react");
const button_1 = require("../ui/button");
const select_1 = require("../ui/select");
const input_1 = require("../ui/input");
const alert_dialog_1 = require("../ui/alert-dialog");
const sonner_1 = require("sonner");
const NodeType_1 = require("../types/NodeType");
const JsonObjects_1 = require("../objects/JsonObjects");
require("@xyflow/react/dist/style.css");
exports.nodesObject = JSON.parse(localStorage.getItem("nodesObject") || "{}");
const initialNodes = JSON.parse(localStorage.getItem("nodes") || "[]");
const initialEdges = JSON.parse(localStorage.getItem("edges") || "[]");
const Editor = () => {
    const [nodes, setNodes, onNodesChange] = (0, react_2.useNodesState)(initialNodes);
    const [edges, setEdges, onEdgesChange] = (0, react_2.useEdgesState)(initialEdges);
    const [selectedEdge, setSelectedEdge] = (0, react_1.useState)(null);
    const [nodeData, setNodeData] = (0, react_1.useState)({
        nodeID: "",
        nodeType: "",
        nodeTrigger: "",
        numChoices: 0,
        numCommands: 0,
    });
    const [selectedNodeId, setSelectedNodeId] = (0, react_1.useState)(null);
    const [editedJson, setEditedJson] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        localStorage.setItem("nodes", JSON.stringify(nodes));
    }, [nodes]);
    (0, react_1.useEffect)(() => {
        localStorage.setItem("edges", JSON.stringify(edges));
    }, [edges]);
    (0, react_1.useEffect)(() => {
        localStorage.setItem("nodesObject", JSON.stringify(exports.nodesObject));
    }, [nodes]);
    const handleDeleteAll = () => {
        setNodes([]);
        setEdges([]);
        Object.keys(exports.nodesObject).forEach((key) => delete exports.nodesObject[key]);
        localStorage.removeItem("nodes");
        localStorage.removeItem("edges");
        localStorage.removeItem("nodesObject");
        sonner_1.toast.success("All nodes, edges, and node objects have been deleted.");
    };
    const updateNodeData = (key, value) => {
        setNodeData((prev) => (Object.assign(Object.assign({}, prev), { [key]: value })));
    };
    const onConnect = (0, react_1.useCallback)((params) => {
        setEdges((eds) => (0, react_2.addEdge)(params, eds));
        const { source, target, sourceHandle } = params;
        if (!source || !target)
            return;
        if (exports.nodesObject[source]) {
            if (exports.nodesObject[source].node_type === "CHOICE" && sourceHandle) {
                const choiceIndex = parseInt(sourceHandle.split("-").pop(), 10);
                if (!isNaN(choiceIndex)) {
                    exports.nodesObject[source].node_settings.choices[choiceIndex].node = target;
                }
            }
            else {
                exports.nodesObject[source].next_node = target;
            }
        }
        sonner_1.toast.success(`Connected ${source} to ${target}`);
    }, [setEdges]);
    const handleEdgeClick = (event, edge) => {
        event.stopPropagation();
        setSelectedEdge(edge);
    };
    const handleRemoveSelectedEdge = () => {
        var _a, _b;
        if (!selectedEdge) {
            sonner_1.toast.error("No edge selected");
            return;
        }
        const { source, target } = selectedEdge;
        setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== selectedEdge.id));
        if (((_a = exports.nodesObject[source]) === null || _a === void 0 ? void 0 : _a.next_node) === target) {
            exports.nodesObject[source].next_node = "";
        }
        if (((_b = exports.nodesObject[source]) === null || _b === void 0 ? void 0 : _b.node_type) === "CHOICE") {
            exports.nodesObject[source].node_settings.choices.forEach((choice) => {
                if (choice.node === target) {
                    choice.node = "";
                }
            });
        }
        setSelectedEdge(null);
        sonner_1.toast.success(`Removed edge from ${source} to ${target}`);
    };
    const onAdd = (0, react_1.useCallback)(() => {
        const { nodeID, nodeType, nodeTrigger, numChoices, numCommands } = nodeData;
        if (!nodeID) {
            (0, sonner_1.toast)("Please provide a valid Node ID");
            return;
        }
        if (!nodeType || !nodeTrigger) {
            (0, sonner_1.toast)("Please select a valid Node Type and Trigger Type");
            return;
        }
        if (exports.nodesObject[nodeID]) {
            (0, sonner_1.toast)("Node ID already exists");
            return;
        }
        if (numChoices < 0) {
            (0, sonner_1.toast)("Please provide a valid number of choices");
            return;
        }
        if (numCommands < 0) {
            (0, sonner_1.toast)("Please provide a valid number of commands");
            return;
        }
        const nodeObject = {
            [nodeID]: {
                node_type: nodeType,
                node_settings: (0, JsonObjects_1.GetNode)(nodeType, numChoices),
                next_node: "",
                trigger: (0, JsonObjects_1.GetTrigger)(nodeTrigger),
                requirements: [],
                commands: (0, JsonObjects_1.GetCommands)(numCommands),
            },
        };
        exports.nodesObject[nodeID] = nodeObject[nodeID];
        const newNode = {
            id: nodeID,
            type: "NodeType",
            data: Object.assign(Object.assign({}, nodeData), { label: nodeID }),
            position: {
                x: (Math.random() - 0.5) * 100,
                y: (Math.random() - 0.5) * 100,
            },
        };
        setNodes((nds) => nds.concat(newNode));
    }, [nodeData, setNodes]);
    const onNodeClick = (0, react_1.useCallback)((_event, node) => {
        setSelectedNodeId(node.id);
        if (exports.nodesObject[node.id]) {
            setEditedJson(JSON.stringify(exports.nodesObject[node.id], null, 2));
        }
    }, []);
    const handleSave = () => {
        try {
            const parsedJson = JSON.parse(editedJson);
            if (selectedNodeId !== null) {
                exports.nodesObject[selectedNodeId] = parsedJson;
            }
            else {
                sonner_1.toast.error("No node selected");
                return;
            }
            sonner_1.toast.success("Node updated successfully");
        }
        catch (error) {
            sonner_1.toast.error("Invalid JSON format");
        }
    };
    const handleDelete = () => {
        if (!selectedNodeId)
            return;
        const updatedNodes = nodes.filter((node) => node.id !== selectedNodeId);
        setNodes(updatedNodes);
        Object.keys(exports.nodesObject).forEach((nodeId) => {
            if (exports.nodesObject[nodeId].next_node === selectedNodeId) {
                exports.nodesObject[nodeId].next_node = "";
            }
            if (exports.nodesObject[nodeId].node_type === "CHOICE") {
                exports.nodesObject[nodeId].node_settings.choices.forEach((choice) => {
                    if (choice.node === selectedNodeId) {
                        choice.node = "";
                    }
                });
            }
        });
        delete exports.nodesObject[selectedNodeId];
        const updatedEdges = edges.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId);
        setEdges(updatedEdges);
        setSelectedNodeId(null);
        setEditedJson("");
        sonner_1.toast.success("Node deleted successfully");
    };
    const nodeTypes = (0, react_1.useMemo)(() => ({
        NodeType: (props) => (<NodeType_1.NodeType {...props} isSelected={props.id === selectedNodeId}/>),
    }), [selectedNodeId]);
    return (<div className="flex flex-row gap-12">
      <div className="w-[1080px] h-[720px]">
        <react_2.ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onNodeClick={onNodeClick} onEdgeClick={handleEdgeClick} fitView fitViewOptions={{ padding: 2 }} style={{ backgroundColor: "#F7F9FB" }} nodeTypes={nodeTypes}>
          <react_2.Background />
          <react_2.Panel position="bottom-left" className="flex flex-row justify-end gap-5">
            <div className="bg-slate-900 w-[315px] p-5 rounded-lg flex flex-col gap-2">
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>Node ID</label>
                </div>
                <input_1.Input type="text" id="nodeID" placeholder="Node ID" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition" onChange={(e) => updateNodeData("nodeID", e.target.value)} value={nodeData.nodeID}/>
              </div>
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>Node Type</label>
                </div>
                <select_1.Select onValueChange={(value) => updateNodeData("nodeType", value)}>
                  <select_1.SelectTrigger id="nodeType" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition">
                    <select_1.SelectValue placeholder="Node Type"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectGroup>
                      <select_1.SelectItem value="TITLE">Title Node</select_1.SelectItem>
                      <select_1.SelectItem value="SUBTITLE">Subtitle Node</select_1.SelectItem>
                      <select_1.SelectItem value="INPUT">Input Node</select_1.SelectItem>
                      <select_1.SelectItem value="CHOICE">Choice Node</select_1.SelectItem>
                      <select_1.SelectItem value="DISPLAY">Display Node</select_1.SelectItem>
                      <select_1.SelectItem value="CHAT">Chat Node</select_1.SelectItem>
                      <select_1.SelectItem value="BOSS_BAR">Boss Bar Node</select_1.SelectItem>
                      <select_1.SelectItem value="ACTION_BAR">Action Bar Node</select_1.SelectItem>
                    </select_1.SelectGroup>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              {nodeData.nodeType === "CHOICE" && (<div className="flex flex-row text-white justify-between align-middle font-bold">
                  <div className="flex items-center justify-center">
                    <label>No. Choices</label>
                  </div>
                  <input_1.Input type="number" id="numChoices" placeholder="Choices" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition" onChange={(e) => updateNodeData("numChoices", parseInt(e.target.value))} value={nodeData.numChoices}/>
                </div>)}
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>Trigger Type</label>
                </div>
                <select_1.Select onValueChange={(value) => updateNodeData("nodeTrigger", value)}>
                  <select_1.SelectTrigger id="triggerType" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition">
                    <select_1.SelectValue placeholder="Trigger Type"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectGroup>
                      <select_1.SelectItem value="BLOCK">Block Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="ITEM">Item Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="COMMAND">Command Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="LOCATION">Location Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="ENTITY">Entity Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="ELIMINATE">Eliminate Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="TIME">Time Trigger</select_1.SelectItem>
                      <select_1.SelectItem value="INTERACT">Interact Trigger</select_1.SelectItem>
                    </select_1.SelectGroup>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="flex flex-row text-white justify-between align-middle font-bold">
                <div className="flex items-center justify-center">
                  <label>No. Commands</label>
                </div>
                <input_1.Input type="number" id="numCommands" placeholder="Commands" className="w-[150px] h-[40px] bg-slate-700 text-white border-black active:scale-95 transition" onChange={(e) => updateNodeData("numCommands", parseInt(e.target.value))} value={nodeData.numCommands}/>
              </div>
              <div className="flex items-center justify-between pt-5">
                <alert_dialog_1.AlertDialog>
                  <alert_dialog_1.AlertDialogTrigger asChild>
                    <button_1.Button className="w-[75px] bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:scale-95 transition">
                      Delete All
                    </button_1.Button>
                  </alert_dialog_1.AlertDialogTrigger>
                  <alert_dialog_1.AlertDialogContent>
                    <alert_dialog_1.AlertDialogHeader>
                      <alert_dialog_1.AlertDialogTitle>Confirm Deletion</alert_dialog_1.AlertDialogTitle>
                      <alert_dialog_1.AlertDialogDescription>
                        Are you sure you want to delete all nodes, edges, and node objects? This action cannot be undone.
                      </alert_dialog_1.AlertDialogDescription>
                    </alert_dialog_1.AlertDialogHeader>
                    <alert_dialog_1.AlertDialogFooter>
                      <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                      <alert_dialog_1.AlertDialogAction onClick={handleDeleteAll} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        Confirm
                      </alert_dialog_1.AlertDialogAction>
                    </alert_dialog_1.AlertDialogFooter>
                  </alert_dialog_1.AlertDialogContent>
                </alert_dialog_1.AlertDialog>
                <button_1.Button className="w-[150px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0 hover:text-white" variant="outline" onClick={onAdd}>
                  Create Node
                </button_1.Button>
              </div>
            </div>
          </react_2.Panel>
        </react_2.ReactFlow>
      </div>
      <div className="w-[350px] bg-slate-900 shadow-md rounded-md">
        <h2 className="font-bold text-xl mb-4 text-white">Node Details</h2>
        {selectedNodeId ? (<>
            <textarea className="w-full h-[550px] p-2 border border-gray-300 rounded-md mb-4 bg-slate-100" value={editedJson} onChange={(e) => setEditedJson(e.target.value)} spellCheck={false}/>

            <div className="flex gap-2 justify-evenly">
              <alert_dialog_1.AlertDialog>
                <alert_dialog_1.AlertDialogTrigger>
                  <button_1.Button variant="outline" className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition border-0 hover:text-white" disabled={!selectedEdge}>
                    Remove Edge
                  </button_1.Button>
                </alert_dialog_1.AlertDialogTrigger>
                <alert_dialog_1.AlertDialogContent>
                  <alert_dialog_1.AlertDialogHeader>
                    <alert_dialog_1.AlertDialogTitle>Confirm Deletion</alert_dialog_1.AlertDialogTitle>
                    <alert_dialog_1.AlertDialogDescription>
                      Are you sure you want to save delete this edge? This action cannot be undone.
                    </alert_dialog_1.AlertDialogDescription>
                  </alert_dialog_1.AlertDialogHeader>
                  <alert_dialog_1.AlertDialogFooter>
                    <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                    <alert_dialog_1.AlertDialogAction onClick={handleRemoveSelectedEdge}>Continue</alert_dialog_1.AlertDialogAction>
                  </alert_dialog_1.AlertDialogFooter>
                </alert_dialog_1.AlertDialogContent>
              </alert_dialog_1.AlertDialog>
              <alert_dialog_1.AlertDialog>
                <alert_dialog_1.AlertDialogTrigger>
                  <button_1.Button variant="outline" className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0">
                    Save Changes
                  </button_1.Button>
                </alert_dialog_1.AlertDialogTrigger>
                <alert_dialog_1.AlertDialogContent>
                  <alert_dialog_1.AlertDialogHeader>
                    <alert_dialog_1.AlertDialogTitle>Confirm Save</alert_dialog_1.AlertDialogTitle>
                    <alert_dialog_1.AlertDialogDescription>
                      Are you sure you want to save changes to this node?
                    </alert_dialog_1.AlertDialogDescription>
                  </alert_dialog_1.AlertDialogHeader>
                  <alert_dialog_1.AlertDialogFooter>
                    <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                    <alert_dialog_1.AlertDialogAction onClick={handleSave}>Continue</alert_dialog_1.AlertDialogAction>
                  </alert_dialog_1.AlertDialogFooter>
                </alert_dialog_1.AlertDialogContent>
              </alert_dialog_1.AlertDialog>
              <alert_dialog_1.AlertDialog>
                <alert_dialog_1.AlertDialogTrigger>
                  <button_1.Button variant="outline" className="w-[95px] bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 active:scale-95 transition hover:text-white border-0">
                    Delete Node
                  </button_1.Button>
                </alert_dialog_1.AlertDialogTrigger>
                <alert_dialog_1.AlertDialogContent>
                  <alert_dialog_1.AlertDialogHeader>
                    <alert_dialog_1.AlertDialogTitle>Confirm Deletion</alert_dialog_1.AlertDialogTitle>
                    <alert_dialog_1.AlertDialogDescription>
                      Are you sure you want to delete this node? This action cannot be undone.
                    </alert_dialog_1.AlertDialogDescription>
                  </alert_dialog_1.AlertDialogHeader>
                  <alert_dialog_1.AlertDialogFooter>
                    <alert_dialog_1.AlertDialogCancel>Cancel</alert_dialog_1.AlertDialogCancel>
                    <alert_dialog_1.AlertDialogAction onClick={handleDelete}>Continue</alert_dialog_1.AlertDialogAction>
                  </alert_dialog_1.AlertDialogFooter>
                </alert_dialog_1.AlertDialogContent>
              </alert_dialog_1.AlertDialog>
            </div>
          </>) : (<p className="text-white">No node selected</p>)}
      </div>
    </div>);
};
exports.default = () => (<react_2.ReactFlowProvider>
    <Editor />
  </react_2.ReactFlowProvider>);
