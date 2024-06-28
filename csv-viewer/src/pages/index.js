import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import CSVViewer from '../components/CSVViewer';
import ChordDiagram from '../components/Chart';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshFiles, setRefreshFiles] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = () => {
    setRefreshFiles(!refreshFiles);
  };

  const handleFileSelect = async (filename) => {
    setSelectedFile(filename);
    try {
      const response = await fetch(`/api/csv/${filename}`);
      if (response.ok) {
        const data = await response.json();
        setCSVData(data);
        if (data.length > 0) {
          setHeaders(Object.keys(data[0]));
        }
      } else {
        console.error('Failed to fetch CSV data');
      }
    } catch (error) {
      console.error('Error fetching CSV data:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">CSV Viewer and Analyzer</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload CSV File</h2>
        <FileUpload onUpload={handleFileUpload} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">CSV Files</h2>
          <FileList onFileSelect={handleFileSelect} key={refreshFiles} />
        </div>

        {selectedFile && (
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">CSV Data</h2>
            <CSVViewer data={csvData} headers={headers} />

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Data Visualization</h2>
              <select 
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="mb-4 p-2 border rounded"
              >
                <option value="">Select a column for chart</option>
                {headers.map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
              {selectedColumn && <ChordDiagram data={csvData} column={selectedColumn} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}