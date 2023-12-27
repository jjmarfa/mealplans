import { Input, Tag } from "antd";
import { FC, useState } from "react";

interface InputTagProps {
  value?: string[] | null;
  placeholder?: string;
  onChange?: (value: string[]) => void;
}

const InputTag: FC<InputTagProps> = ({ value: v, placeholder, onChange }) => {
  const value = v || [];
  const [inputValue, setInputValue] = useState("");

  function handleChange() {
    onChange && onChange([...value, inputValue]);
    setInputValue("");
  }

  function handleRemove(tag: string) {
    const newTags = value.filter((t) => t !== tag);
    onChange && onChange(newTags);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        {value.map((tag) => (
          <Tag
            key={tag}
            closable
            style={{ userSelect: "none" }}
            onClose={() => handleRemove(tag)}
          >
            {tag}
          </Tag>
        ))}
      </div>

      <Input
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onPressEnter={() => handleChange()}
      />
    </div>
  );
};

export default InputTag;
