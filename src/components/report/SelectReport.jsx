import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from "../ui/select";

export const SelectReport = ({ onChange }) => {
  const handleSelectChange = (value) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full h-10 border border-gray-300 rounded-md shadow-sm focus:border-2 focus:border-emerald-600">
          <SelectValue placeholder="Select a reason" />
        </SelectTrigger>
        <SelectContent className="w-full">
          <SelectItem value="spam">Spam</SelectItem>
          <SelectItem value="harassment">Harassment</SelectItem>
          <SelectItem value="inappropriate">Inappropriate content</SelectItem>
          <SelectItem value="cheat">Cheat</SelectItem>
          <SelectItem value="username">Username</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
