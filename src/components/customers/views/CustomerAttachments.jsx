import React, { useState } from "react";
import {
  Cross2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  // TrashIcon,
  FileIcon,
} from "@radix-ui/react-icons";
// import FileUpload from "../../shared/FileUpload";
import { handleDownload } from "../../../utils/fileDownload";
import PropTypes from "prop-types";

const CustomerAttachments = ({
  attachments,
  // readOnly = false,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageFiles = attachments?.filter((file) =>
    file.link.includes("images/")
  );
  const documentFiles = attachments?.filter((file) =>
    file.link.includes("documents/")
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imageFiles.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === imageFiles.length - 1 ? 0 : prev + 1
    );
  };

  // const handleFilesAdded = async (files) => {
  //   const validFiles = files?.filter((file) => file.size <= 10 * 1024 * 1024);
  //   await onAddFiles(validFiles);
  // };

  return (
    <div className="space-y-6">
      {/* {!readOnly && <FileUpload onFilesAdded={handleFilesAdded} />} */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Images Section */}
        {imageFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Images</h3>
            <div className="grid grid-cols-2 gap-4">
              {imageFiles?.map((file, index) => (
                <div
                  key={index}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 cursor-pointer"
                  onClick={() => {
                    setSelectedImage(file);
                    setCurrentImageIndex(imageFiles.indexOf(file));
                  }}
                >
                  <img
                    src={file.link}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <p className="text-sm text-white text-center px-2 truncate">
                      {file.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {documentFiles.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Documents</h3>
            <div className="space-y-3">
              {documentFiles?.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/10 rounded-lg group"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-5 w-5 text-white/60" />
                    <div className="flex flex-col">
                      <span className="text-sm text-white truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DownloadIcon
                      onClick={() => handleDownload(file.link)}
                      className="h-4 w-4 text-white/60 cursor-pointer"
                    />
                    {/* {!readOnly && (
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <TrashIcon className="h-4 w-4 text-red-400" />
                      </button>
                    )} */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="relative w-full max-w-4xl p-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <Cross2Icon className="h-6 w-6 text-white" />
            </button>

            {imageFiles.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronLeftIcon className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronRightIcon className="h-6 w-6 text-white" />
                </button>
              </>
            )}

            <img
              src={imageFiles[currentImageIndex].link}
              alt={imageFiles[currentImageIndex].name}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />

            <div className="absolute bottom-4 left-4 right-4 text-white bg-black/50 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm">{imageFiles[currentImageIndex].name}</p>
              <p className="text-xs text-gray-300">
                {(imageFiles[currentImageIndex].size / 1024 / 1024).toFixed(2)}{" "}
                MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CustomerAttachments.propTypes = {
  attachments: PropTypes.array,
  onAddFiles: PropTypes.func,
  onDeleteFile: PropTypes.func,
  readOnly: PropTypes.bool,
};

export default CustomerAttachments;
