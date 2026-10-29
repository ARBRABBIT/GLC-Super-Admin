import React, { useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { useFileDownload } from "@/features/super-admin/utils/useFileDownload";

export interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  progress: number;
  url?: string;
  status: "uploading" | "completed";
  imageType?: "cover" | "land";
}

export interface UploadFileProps {
  uploadedFiles: UploadedFileItem[];
  onFileUpload: (files: FileList) => void;
  onFileDelete: (fileId: string) => void;
  onUploadClick?: () => void; // Optional custom click handler
  groupByImageType?: boolean; // Optional flag to group files by imageType
  hideDropzone?: boolean; // Optional flag to hide the drag-and-drop zone
}

const FileListItem: React.FC<{ 
  file: UploadedFileItem; 
  onFileDelete: (id: string) => void;
  onFileDownload?: (url: string, filename: string) => void;
  isDownloading?: boolean;
}> = ({ file, onFileDelete, onFileDownload, isDownloading }) => (
  <div className="relative w-full shrink-0 min-h-[70px] bg-[#F6F9E2] rounded-[12px] mb-[4px] group flex flex-row items-center px-4 py-3 gap-4">
    <div className="flex items-center justify-center bg-white w-[38px] h-[38px] rounded-[4px] shrink-0">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[20px] h-[20px]">
        <path d="M12 2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 9H5v-1h6v1zm0-2H5V8h6v1zm0-2H5V6h6v1z" fill="#BDD327"/>
      </svg>
    </div>

    <div className="flex flex-col justify-center flex-1 min-w-0">
      <span className="truncate text-black font-['Inter',_sans-serif] font-normal text-[16px] leading-[20px] block" title={file.name}>
        {file.name}
      </span>
      <span className="font-['Inter',_sans-serif] font-normal text-[12px] text-[rgba(0,0,0,0.7)] mt-1">
        {file.size}
      </span>
    </div>

    <div className="flex flex-row items-center gap-2 shrink-0">
      {file.url && onFileDownload && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFileDownload(file.url!, file.name);
          }}
          disabled={isDownloading}
          className="flex items-center justify-center bg-white cursor-pointer hover:bg-blue-50 hover:text-blue-500 rounded transition-colors w-[34px] h-[34px] border-none disabled:opacity-50"
          title="Download Document"
        >
          {isDownloading ? (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[rgba(0,0,0,0.82)]">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onFileDelete(file.id);
        }}
        className="flex items-center justify-center bg-white cursor-pointer hover:bg-red-50 hover:text-red-500 rounded transition-colors w-[34px] h-[34px] border-none"
        title="Delete Document"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px] text-[rgba(0,0,0,0.82)]">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      </button>
    </div>
  </div>
);

export const UploadFile: React.FC<UploadFileProps> = ({
  uploadedFiles,
  onFileUpload,
  onFileDelete,
  onUploadClick,
  groupByImageType = false,
  hideDropzone = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const { downloadFile, isDownloading } = useFileDownload();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFiles = (files: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isValidType = file.type.startsWith('image/') || 
                         ['pdf', 'docx', 'doc', 'png', 'jpg', 'jpeg'].includes(ext || '');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) {
        toast.error(`"${file.name}" is not a supported format. Please upload PDF, DOCX, or Images.`);
      } else if (!isValidSize) {
        toast.error(`"${file.name}" is too large. Max size is 5MB.`);
      } else {
        validFiles.push(file);
      }
    }
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const valid = validateFiles(e.dataTransfer.files);
      if (valid.length > 0) {
        const dt = new DataTransfer();
        valid.forEach(f => dt.items.add(f));
        onFileUpload(dt.files);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const valid = validateFiles(e.target.files);
      if (valid.length > 0) {
        const dt = new DataTransfer();
        valid.forEach(f => dt.items.add(f));
        onFileUpload(dt.files);
      }
      // Reset input value to allow uploading the same file again if needed
      e.target.value = "";
    }
  };

  const triggerUploadClick = () => {
    if (onUploadClick) {
      onUploadClick();
    } else {
      fileInputRef.current?.click();
    }
  };

  const groupedFiles = useMemo(() => {
    if (!groupByImageType) return { all: uploadedFiles };
    return uploadedFiles.reduce((acc, file) => {
      const type = file.imageType || "other";
      if (!acc[type]) acc[type] = [];
      acc[type].push(file);
      return acc;
    }, {} as Record<string, UploadedFileItem[]>);
  }, [uploadedFiles, groupByImageType]);

  return (
    <div className={`grid grid-cols-1 ${hideDropzone ? 'xl:grid-cols-1' : 'xl:grid-cols-2'} gap-6 w-full items-start`}>
      {/* Upload Dropzone */}
      {!hideDropzone && (
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerUploadClick}
        className={`relative flex flex-col items-center justify-center w-full min-h-[250px] py-8 transition-all cursor-pointer ${
          dragActive ? "bg-[#F3F4F1]" : "bg-[#F9FAFB]"
        } border-2 border-dashed border-[#E1E5EF] rounded-[12px]`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,image/*"
        />

        <div className="flex items-center justify-center bg-[#E6EEAD] w-[50px] h-[50px] rounded-full mb-3">
          <div className="flex items-center justify-center w-[36px] h-[36px] bg-[#2A3008] shadow-[0px_4px_10px_rgba(0,0,0,0.15)] rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[18px] h-[18px] text-white"
            >
              <line x1="12" y1="15" x2="12" y2="3" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="5" y1="21" x2="19" y2="21" />
            </svg>
          </div>
        </div>

        <span className="font-sans font-bold text-[#1A1C1D] text-lg mb-1">
          Upload
        </span>

        <span className="font-sans font-normal text-[#414755] text-xs text-center max-w-[250px] mb-4">
          Drag and drop your files here or click to browse your computer.
        </span>

        <button
          type="button"
          className="flex items-center justify-center px-6 py-2 bg-[#2A3008] text-white font-sans font-medium text-sm rounded-full shadow-md hover:scale-105 active:scale-95 transition-all border-none cursor-pointer mb-6"
        >
          Choose File
        </button>

        <div className="absolute bottom-3 left-4 flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 15 15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="w-[12px] h-[12px] text-gray-500"
          >
            <path d="M3.5 1.5h5l3 3v9a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1z" />
            <path d="M8.5 1.5v3h3" />
          </svg>
          <span className="font-sans text-[11px] text-gray-500 flex items-center">
            Format:&nbsp;<strong>PDF, DOCX, JPG, PNG</strong>
          </span>
        </div>

        <div className="absolute bottom-3 right-4 flex items-center gap-1">
          <span className="font-sans text-[11px] text-gray-500 flex items-center">
            Max Size:&nbsp;<strong>5MB</strong>
          </span>
        </div>
      </div>
      )}

      {/* Uploaded Files Section */}
      <div className="flex flex-col w-full gap-4">
        <h4 className="font-sans font-semibold text-[16px] text-black m-0">
          Uploaded Files
        </h4>

        <div className="flex flex-col w-full gap-3 overflow-y-auto max-h-[300px] pr-2">
          {uploadedFiles.length === 0 ? (
            <span className="text-gray-400 font-sans text-sm">
              No files uploaded yet.
            </span>
          ) : (
            Object.entries(groupedFiles).map(([groupType, groupFiles]) => (
              <div key={groupType} className="w-full flex flex-col gap-2">
                {groupByImageType && (
                  <span className="text-[rgba(0,_0,_0,_0.8)] font-sans text-xs capitalize">
                    {groupType} images
                  </span>
                )}
                {(groupFiles as UploadedFileItem[]).map((file: UploadedFileItem) => (
                  <FileListItem 
                    key={file.id} 
                    file={file} 
                    onFileDelete={onFileDelete} 
                    onFileDownload={downloadFile}
                    isDownloading={isDownloading}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
