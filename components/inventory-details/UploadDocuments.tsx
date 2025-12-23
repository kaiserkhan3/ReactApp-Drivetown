"use client";
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
import { ImageSlider } from "./image-slider";

export type DocumentsMetaData = {
  label: string;
  docType: string;
  name: string;
};

type Props = {
  inventoryId: number;
  fileUploadConfiguration: DocumentsMetaData[];
  showSlider: boolean;
};

export default function UploadInventoryDocuments({
  inventoryId,
  fileUploadConfiguration,
  showSlider,
}: Props) {
  const docTypes = fileUploadConfiguration.map((i) => i.docType);

  const { filesData, getFilesData, isPending } = useGetInventoryFiles({
    inventoryId,
    docTypes,
  });
  const { deleteFile, isDeleteFilePending } = useDeleteInventoryFiles();

  useEffect(() => {
    getFilesData();
  }, []);

  if (isPending || isDeleteFilePending) return <ThreeDotLoader />;

  const fileUploadHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;
    if (!files?.length) return;

    const formData = new FormData();
    [...files].forEach((f) => formData.append("files", f));
    formData.append(
      "data",
      JSON.stringify({ inventoryId, imageType: name, docTypes })
    );

    const data = await uploadInventoryDocuments(formData);
    if (data) getFilesData();
  };

  const onDeleteFileHandler = (row: InventoryImageDto) => {
    deleteFile({ inventoryImageDto: row, docTypes });
    setTimeout(getFilesData, 500);
  };

  const handleOpenDocumentClick = (row: InventoryImageDto) => {
    const uri = `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}vehicle/${row.imageName}`;
    window.open(uri, "_blank");
  };

  return (
    <>
      <div className="row mt-3">
        {fileUploadConfiguration.map(({ label, docType }) => (
          <div className="col" key={docType}>
            <FileUpload
              label={label}
              docType={docType}
              handleChange={fileUploadHandler}
            />
          </div>
        ))}
      </div>
      <div className="row">
        {fileUploadConfiguration.map(({ docType, name }) => (
          <div className="col" key={docType}>
            <UploadedDocumentsList
              docType={docType}
              name={name}
              filesData={filesData!}
              onDeleteFileHandler={onDeleteFileHandler}
              onOpenFileHandler={handleOpenDocumentClick}
            />
          </div>
        ))}
      </div>
      {showSlider && (
        <div className="row">
          <ImageSlider images={filesData!} />
        </div>
      )}
    </>
  );
}
