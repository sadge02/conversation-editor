import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface SubtitleFormProps {
  subtitle: string;
  setSubtitle: (value: string) => void;
}

const SubtitleForm: React.FC<SubtitleFormProps> = ({ subtitle, setSubtitle }) => {
  return (
    <div>
      <Label htmlFor="subtitleText">Subtitle Text</Label>
      <Input
        id="subtitleText"
        value={subtitle || ""}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Enter subtitle text"
      />
    </div>
  );
}

export { SubtitleForm };