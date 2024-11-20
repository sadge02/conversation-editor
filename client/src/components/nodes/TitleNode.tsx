import { memo, useContext } from "react";
import { Handle, Position, NodeToolbar } from "reactflow";
import flowContext from "../../App";

const CustomNode = (props) => {
  const flow = useContext(flowContext);
  const sidebarStatus = flow.sidebarStatus;
  const setSidebarStatus = flow.setSidebarStatus;

  return (
    <>
      <div className="custom-node">
        <NodeToolbar
          isVisible={props.data.toolbarVisible}
          position={props.data.toolbarPosition}
        >
          <button onClick={() => setSidebarStatus(!sidebarStatus)}>
            open sidebar
          </button>
        </NodeToolbar>
        <div style={{ padding: "10px 20px" }}>{props.data.label}</div>
        <Handle type="target" position={Position.Left} />
        <Handle type="source" position={Position.Right} />
      </div>
    </>
  );
};

export default memo(CustomNode);
