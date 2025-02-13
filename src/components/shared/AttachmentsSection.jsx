import { useState } from "react";
import { FileIcon, DownloadIcon, TrashIcon } from "@radix-ui/react-icons";
import FileUpload from "./FileUpload";
import { addBaseURL } from "../../utils/updateURL";
import { handleDownload } from "../../utils/fileDownload";

const AttachmentsSection = ({
  existingFiles = [],
  newFiles = [],
  onAddFiles,
  onRemoveExisting,
  onRemoveNew,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAdded = async (files) => {
    setIsUploading(true);
    try {
      // Filter files larger than 10MB
      const validFiles = files?.filter((file) => file.size <= 10 * 1024 * 1024);
      onAddFiles(validFiles);
    } catch (error) {
      console.error("Error handling files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Attachments</h3>
        <FileUpload onFilesAdded={handleFilesAdded} />
      </div>

      {(existingFiles.length > 0 || newFiles.length > 0) && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-400">Uploaded Files</h4>
          <div className="space-y-3">
            {existingFiles?.map((file, index) => (
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
                    onClick={() => handleDownload(addBaseURL(file.link))}
                    className="h-4 w-4 text-white/60"
                  />

                  {onRemoveExisting && (
                    <button
                      onClick={() => onRemoveExisting(file)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <TrashIcon className="h-4 w-4 text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {newFiles?.map((file, index) => (
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
                {onRemoveNew && (
                  <button
                    onClick={() => onRemoveNew(index)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <TrashIcon className="h-4 w-4 text-red-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center justify-center p-4">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default AttachmentsSection;
