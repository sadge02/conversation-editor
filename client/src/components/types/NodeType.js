"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeType = void 0;
const react_1 = require("react");
const react_2 = require("@xyflow/react");
require("@xyflow/react/dist/style.css");
const NodeType = ({ data, isSelected }) => {
    const updateNodeInternals = (0, react_2.useUpdateNodeInternals)();
    (0, react_1.useEffect)(() => {
        setTimeout(() => {
            updateNodeInternals(data.nodeID);
        }, 0);
    }, [data.nodeID, updateNodeInternals, data, isSelected]);
    return (<div id={data.nodeID} style={{
            border: isSelected ? "2px solid #007BFF" : "2px solid #333",
            padding: "10px",
            borderRadius: "8px",
            backgroundColor: isSelected ? "#D8EAFE" : "#f0f0f0",
            textAlign: "center",
            position: "relative",
        }}>
      <react_2.Handle type="target" isConnectable={true} isConnectableEnd={true} isConnectableStart={false} position={react_2.Position.Top} style={{ background: "#128011" }}/>
      <strong>{data.nodeID}</strong>
      <br />
      {data.nodeType} Node
      <br />
      {data.nodeTrigger} Trigger
      {data.nodeType === "CHOICE" &&
            Array.from({ length: data.numChoices }, (_, index) => {
                var _a, _b;
                return (<react_2.Handle id={`${data.nodeID}-${index}`} key={index} type="source" isConnectable={true} isConnectableEnd={false} isConnectableStart={true} position={react_2.Position.Bottom} style={{
                        left: (((_b = (_a = document.getElementById(data.nodeID)) === null || _a === void 0 ? void 0 : _a.offsetWidth) !== null && _b !== void 0 ? _b : 0) / (data.numChoices + 1)) * (index + 1),
                        background: "#f54251",
                        position: "absolute",
                    }}/>);
            })}
      {data.nodeType !== "CHOICE" && (<react_2.Handle id={`${data.nodeID}-0`} key={0} type="source" isConnectable={true} isConnectableEnd={false} isConnectableStart={true} position={react_2.Position.Bottom} style={{ background: "#f54251" }}/>)}
    </div>);
};
exports.NodeType = NodeType;
