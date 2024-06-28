import { useState, useEffect } from 'react';

export default function FileList({ onFileSelect }) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/upload');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  return (
    <ul>
      {files.map((file) => (
        <li key={file._id} onClick={() => onFileSelect(file.filename)}>
          {file.originalname}
        </li>
      ))}
    </ul>
  );
}