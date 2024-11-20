import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

const TitleNodeForm: React.FC<TitleNodeFormProps> = ({ nodeData, setNodeData }) => {


  return (
    <div>
      {/* Title Text */}
      <div>
        <Label htmlFor="titleText">Title Text</Label>
        <Input
          id="titleText"
          value={nodeData.titleText || ""}
          onChange={(e) => setNodeData({ ...nodeData, titleText: e.target.value })}
          placeholder="Enter title text"
        />
      </div>

      {/* Fade In Duration */}
      <div>
        <Label htmlFor="fadeIn">Fade In Duration (seconds)</Label>
        <Input
          id="fadeIn"
          type="number"
          step="0.1"
          defaultValue={1}
          value={nodeData.fade_in || ""}
          onChange={(e) => setNodeData({ ...nodeData, fade_in: Number(e.target.value) })}
          placeholder="Enter fade-in duration"
          min={0}
        />
      </div>

      {/* Fade Out Duration */}
      <div>
        <Label htmlFor="fadeOut">Fade Out Duration (seconds)</Label>
        <Input
          id="fadeOut"
          type="number"
          step="0.1"
          defaultValue={1}
          value={nodeData.fade_out || ""}
          onChange={(e) => setNodeData({ ...nodeData, fade_out: Number(e.target.value) })}
          placeholder="Enter fade-out duration"
          min={0}
        />
      </div>

      {/* Duration */}
      <div>
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          step="0.1"
          defaultValue={5}
          value={nodeData.duration || ""}
          onChange={(e) => setNodeData({ ...nodeData, duration: Number(e.target.value) })}
          placeholder="Enter duration"
          min={0}
        />
      </div>
    </div>
  );
};

export default TitleNodeForm;
