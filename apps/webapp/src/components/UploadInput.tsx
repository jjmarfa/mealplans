import { Button } from "antd";
import { FC, createRef, useMemo } from "react";

interface UploadButtonProps {
  value?: string | File;
  onChange?: (value: File) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ value, onChange }) => {
  const inputRef = createRef<HTMLInputElement>();
  const image = useMemo(() => {
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }

    return value;
  }, [value]);

  function handleClick() {
    inputRef.current?.click();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onChange) return;

    onChange(file);
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <img src={image} className="w-full" />
      </div>

      <div
        className={`transition absolute top-0 left-0 w-full h-full flex items-center justify-center ${
          image ? "opacity-0" : "opacity-100"
        } hover:opacity-100`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg"
          hidden
          onChange={handleChange}
        />
        <Button onClick={handleClick}>{image ? "Update" : "Upload"}</Button>
      </div>
    </div>
  );
};

export default UploadButton;
