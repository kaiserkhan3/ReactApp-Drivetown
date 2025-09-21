import { InventoryImageDto } from "@/models/inventory/models";

type UploadedDocumentsListProps = {
  filesData: InventoryImageDto[];
  docType: string;
  name: string;
  onDeleteFileHandler: (file: InventoryImageDto) => void;
};

export const UploadedDocumentsList = ({
  filesData,
  docType,
  name,
  onDeleteFileHandler,
}: UploadedDocumentsListProps) => {
  return (
    <>
      {filesData &&
        filesData
          .filter((fd) => fd.imageType === docType)
          .map((file, index) => (
            <div key={file.inventoryImageId}>
              <span className="me-2">{name + (index + 1)}</span>
              <span
                onClick={(e) => {
                  e.preventDefault();
                  return onDeleteFileHandler(file);
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="bi bi-trash" style={{ color: "red" }}></i>
              </span>
            </div>
          ))}
    </>
  );
};
