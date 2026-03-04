import { useState, useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  loading: boolean;
}

export default function FileUpload({ onFileSelect, loading }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-16 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-[#4DB8B0] bg-[#4DB8B0]/10'
          : 'border-[#4A5568] hover:border-[#4DB8B0]/60 hover:bg-[#2D3748]/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".sql,.ddl,.txt"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#4DB8B0]/15 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#4DB8B0]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {loading ? (
          <p className="text-[#A0AEC0]">파일을 읽는 중...</p>
        ) : (
          <>
            <p className="text-lg font-medium text-[#E2E8F0]">
              DDL SQL 파일을 여기에 드래그하세요
            </p>
            <p className="text-sm text-[#718096]">
              또는 클릭하여 파일을 선택하세요 (.sql, .ddl, .txt)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
