"use client";
import { imageType } from "@/models/inventory/enum";
import { ChangeEvent, useEffect } from "react";
import { FileUpload } from "../control-components/FileUpload";
import { uploadInventoryDocuments } from "@/actions/inventory-actions";
import { DeleteFile, InventoryImageDto } from "@/models/inventory/models";
import {
  useDeleteInventoryFiles,
  useGetInventoryFiles,
} from "@/hooks/useInventory";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import { UploadedDocumentsList } from "./UploadedDocumentsList";

export type DocumentsMetaData = {
  label: string;
  docType: string;
  name: string;
};

type UploadInventoryDocumentsProps = {
  inventoryId: number;
  fileUploadConfiguration: DocumentsMetaData[];
};
export default function UploadInventoryDocuments({
  inventoryId,
  fileUploadConfiguration,
}: UploadInventoryDocumentsProps) {
  const { filesData, getFilesData, isPending } = useGetInventoryFiles({
    inventoryId,
    docTypes: fileUploadConfiguration.map((i) => i.docType),
  });

  const { deleteFile, isDeleteFilePending, fileData, isSuccess } =
    useDeleteInventoryFiles();

  useEffect(() => {
    getFilesData();
  }, []);

  if (isDeleteFilePending || isPending) {
    return <ThreeDotLoader />;
  }

  const fileUploadHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    const formData = new FormData();
    if (files?.length === 0) {
      return;
    }
    [...files!].forEach((f) => {
      formData.append("files", f);
    });
    formData.append(
      "data",
      JSON.stringify({
        inventoryId,
        imageType: name,
        docTypes: fileUploadConfiguration.map((i) => i.docType),
      })
    );
    const data = await uploadInventoryDocuments(formData);
    if (data) {
      getFilesData();
    }
  };

  const onDeleteFileHandler = (row: InventoryImageDto) => {
    const data: DeleteFile = {
      inventoryImageDto: row,
      docTypes: fileUploadConfiguration.map((i) => i.docType),
    };
    deleteFile(data);
    setTimeout(() => {
      getFilesData();
    }, 500);
  };

  const hanleOpenDocumentClick = (row: InventoryImageDto) => {
    const uri = `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}vehicle/${row.imageName}`;
    window.open(uri, "_blank");
  };

  return (
    <>
      <div className="row mt-3">
        {fileUploadConfiguration.map((item) => (
          <div className="col" key={item.docType}>
            <FileUpload
              label={item.label}
              docType={item.docType}
              handleChange={fileUploadHandler}
            />
          </div>
        ))}
      </div>
      <div className="row">
        {fileUploadConfiguration.map((item) => (
          <div className="col" key={item.docType}>
            <UploadedDocumentsList
              docType={item.docType}
              name={item.name}
              filesData={filesData!}
              onDeleteFileHandler={onDeleteFileHandler}
              onOpenFileHandler={hanleOpenDocumentClick}
            />
          </div>
        ))}
      </div>
    </>
  );
}
