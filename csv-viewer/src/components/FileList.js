// components/FileList.js
import React, { useState, useEffect } from 'react';

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
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            File Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Upload Date
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {files.map((file) => (
          <tr key={file._id} onClick={() => onFileSelect(file.filename)} className="hover:bg-gray-100 cursor-pointer">
            <td className="px-6 py-4 whitespace-nowrap">{file.originalname}</td>
            <td className="px-6 py-4 whitespace-nowrap">{new Date(file.uploadDate).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}