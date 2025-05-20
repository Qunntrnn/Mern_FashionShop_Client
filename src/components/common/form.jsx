import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import SizesInput from "./sizes-input";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSizesChange = (sizes) => {
    setFormData({
      ...formData,
      sizes,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {formControls.map((control) => {
        switch (control.componentType) {
          case "input":
            return (
              <div key={control.name} className="space-y-2">
                <Label>{control.label}</Label>
                <Input
                  type={control.type}
                  name={control.name}
                  value={formData[control.name]}
                  onChange={handleChange}
                  placeholder={control.placeholder}
                />
              </div>
            );
          case "textarea":
            return (
              <div key={control.name} className="space-y-2">
                <Label>{control.label}</Label>
                <Textarea
                  name={control.name}
                  value={formData[control.name]}
                  onChange={handleChange}
                  placeholder={control.placeholder}
                />
              </div>
            );
          case "select":
            return (
              <div key={control.name} className="space-y-2">
                <Label>{control.label}</Label>
                <Select
                  value={formData[control.name]}
                  onValueChange={(value) => handleSelectChange(control.name, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={control.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {control.options.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            );
          case "sizes":
            return (
              <div key={control.name} className="space-y-2">
                <Label>{control.label}</Label>
                <SizesInput
                  value={formData[control.name] || []}
                  onChange={handleSizesChange}
                />
              </div>
            );
          default:
            return null;
        }
      })}
      <Button type="submit" disabled={isBtnDisabled} className="w-full">
        {buttonText}
      </Button>
    </form>
  );
}

export default CommonForm;
