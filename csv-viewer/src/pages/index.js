import { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import CSVViewer from '../components/CSVViewer';
import Chart from '../components/Chart';
import Typewriter from 'typewriter-effect';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshFiles, setRefreshFiles] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [chartType, setChartType] = useState('chord');

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
    <div className="min-h-screen bg-slate-200 py-8">
      <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
          <Typewriter
            options={{
              strings: ['CSV Viewer and Analyzer'],
              autoStart: true,
              loop: true,
            }}
          />
        </h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Upload CSV File</h2>
          <FileUpload onUpload={handleFileUpload}>
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105">
              Upload CSV
            </button>
          </FileUpload>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">CSV Files</h2>
            <FileList onFileSelect={handleFileSelect} key={refreshFiles} />
          </div>

          {selectedFile && (
            <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">CSV Data</h2>
              <CSVViewer data={csvData} headers={headers} />

              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Data Visualization</h2>
                <div className="flex flex-wrap gap-4 mb-4">
                  <select 
                    onChange={(e) => setSelectedColumn(e.target.value)}
                    className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a column for chart</option>
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                  <select 
                    onChange={(e) => setChartType(e.target.value)}
                    className="p-2 border rounded-md bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="chord">Chord Diagram</option>
                    <option value="bubble">Bubble Chart</option>
                  </select>
                  
                </div>
                {selectedColumn && <Chart data={csvData} column={selectedColumn} chartType={chartType} />}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
