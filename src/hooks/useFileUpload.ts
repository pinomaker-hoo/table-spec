import { useState, useCallback } from 'react';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((f: File) => {
    setLoading(true);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setContent(e.target?.result as string);
      setFile(f);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('fileReadError');
      setLoading(false);
    };
    reader.readAsText(f);
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setContent(null);
    setError(null);
  }, []);

  return { file, content, loading, error, handleFile, reset };
}
