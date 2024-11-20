import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface LocationTriggerFormProps {
  nodeData: any;
  setNodeData: React.Dispatch<React.SetStateAction<any>>;
}

const LocationTriggerForm: React.FC<LocationTriggerFormProps> = ({ nodeData, setNodeData }) => {
  return (
    <div>
      {/* Location Coordinates (x, y, z) */}
      <div>
        <Label htmlFor="locationX">Location X</Label>
        <Input
          id="locationX"
          type="number"
          step="0.1" // Allows decimal values
          value={nodeData.location?.x || ""}
          onChange={(e) =>
            setNodeData({
              ...nodeData,
              location: { ...nodeData.location, x: parseFloat(e.target.value) },
            })
          }
          placeholder="Enter X coordinate"
          min={-1000} // Minimum value for X coordinate (you can adjust this as needed)
        />
      </div>

      <div>
        <Label htmlFor="locationY">Location Y</Label>
        <Input
          id="locationY"
          type="number"
          step="0.1" // Allows decimal values
          value={nodeData.location?.y || ""}
          onChange={(e) =>
            setNodeData({
              ...nodeData,
              location: { ...nodeData.location, y: parseFloat(e.target.value) },
            })
          }
          placeholder="Enter Y coordinate"
          min={-1000} // Minimum value for Y coordinate (you can adjust this as needed)
        />
      </div>

      <div>
        <Label htmlFor="locationZ">Location Z</Label>
        <Input
          id="locationZ"
          type="number"
          step="0.1" // Allows decimal values
          value={nodeData.location?.z || ""}
          onChange={(e) =>
            setNodeData({
              ...nodeData,
              location: { ...nodeData.location, z: parseFloat(e.target.value) },
            })
          }
          placeholder="Enter Z coordinate"
          min={-1000} // Minimum value for Z coordinate (you can adjust this as needed)
        />
      </div>

      {/* Radius */}
      <div>
        <Label htmlFor="radius">Radius</Label>
        <Input
          id="radius"
          type="number"
          step="0.1" // Allows decimal values
          value={nodeData.radius || ""}
          onChange={(e) => setNodeData({ ...nodeData, radius: parseFloat(e.target.value) })}
          placeholder="Enter radius"
          min={0}
        />
      </div>
    </div>
  );
};

export default LocationTriggerForm;
