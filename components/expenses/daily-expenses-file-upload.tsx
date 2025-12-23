"use client";
import { DailyExpenseDto, FileObject } from "@/models/inventory/models";
import { openDocumentInNewTab } from "@/utilities";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type DailyExpensesFileUploadProps = {
  row: DailyExpenseDto;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const DailyExpensesFileUpload = ({
  handleChange,
  row,
}: DailyExpensesFileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <i
        className="bi bi-upload"
        style={{ color: "green", fontSize: "20px", cursor: "pointer" }}
        onClick={(e) => {
          e.preventDefault();
          return fileInputRef.current?.click();
        }}
      ></i>
      <input
        className="form-control"
        onChange={handleChange}
        multiple
        type="file"
        ref={fileInputRef}
        hidden
      />
      <ul>
        {row?.rowFiles && row.rowFiles.length > 0
          ? row.rowFiles.map((file, index) => <li key={index}>{file.name}</li>)
          : null}
      </ul>
    </>
  );
};

export const ParseRawDataToFIleObjects = (
  attachments?: string | null
): FileObject[] => {
  if (!attachments) return [];
  try {
    const cleaned = attachments.replace(/\\"/g, '"');
    const parsed = JSON.parse(cleaned);
    if (Array.isArray(parsed)) return parsed as FileObject[];
  } catch (e) {
    console.error("Failed to parse attachments", e);
  }
  return [];
};

export const DisplayDialyExpenseUploadedFiles = ({
  attachment,
}: {
  attachment?: string | null;
}) => {
  const [rows, setRows] = useState<FileObject[]>([]);

  useEffect(() => {
    const parsed = ParseRawDataToFIleObjects(attachment);
    setRows(parsed);
  }, [attachment]);

  if (!rows || rows.length === 0) return null;

  return (
    <ul>
      {rows?.map((file, index) => (
        <li
          key={`${file.FileName}-${index}`}
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
            fontSize: "12px",
          }}
          onClick={() =>
            file.ModifiedFileName &&
            openDocumentInNewTab("DailyExpenses", file.ModifiedFileName)
          }
        >
          {`Receipt-${index + 1}`}
        </li>
      ))}
    </ul>
  );
};
