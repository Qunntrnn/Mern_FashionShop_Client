import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, X } from "lucide-react";

function SizesInput({ value = [], onChange }) {
  const handleAddSize = () => {
    onChange([...value, { size: "", stock: 0 }]);
  };

  const handleRemoveSize = (index) => {
    const newSizes = value.filter((_, i) => i !== index);
    onChange(newSizes);
  };

  const handleSizeChange = (index, field, newValue) => {
    const newSizes = [...value];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === "stock" ? Number(newValue) : newValue,
    };
    onChange(newSizes);
  };

  return (
    <div className="space-y-4">
      {value.map((size, index) => (
        <div key={index} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label>Size</Label>
            <Input
              value={size.size}
              onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              placeholder="Nhập size (ví dụ: S, M, L)"
            />
          </div>
          <div className="flex-1">
            <Label>Số lượng</Label>
            <Input
              type="number"
              value={size.stock}
              onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
              placeholder="Nhập số lượng"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => handleRemoveSize(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button type="button" onClick={handleAddSize} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Thêm size
      </Button>
    </div>
  );
}

export default SizesInput; 