"use client";
import { ChangeEvent, useRef } from "react";

type FileUploadProps = {
  label: string;
  docType?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const FileUpload = ({
  label,
  docType,
  handleChange,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        className="btn btn-primary btn-hover mb-3"
        onClick={(e) => {
          e.preventDefault();
          return fileInputRef.current?.click();
        }}
      >
        {label}
      </button>
      <input
        className="form-control"
        onChange={(e) => handleChange(e)}
        multiple
        type="file"
        ref={fileInputRef}
        id={docType}
        name={docType}
        hidden
      />
    </>
  );
};
