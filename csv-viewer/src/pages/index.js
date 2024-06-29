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
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">
        <Typewriter
          options={{
            strings: ['CSV Viewer and Analyzer'],
            autoStart: true,
            loop: true,
          }}
        />
      </h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upload CSV File</h2>
        <FileUpload onUpload={handleFileUpload}>
          <button className="cursor-pointer font-semibold overflow-hidden relative z-100 border border-green-500 group px-8 py-2">
            <span className="relative z-10 text-green-500 group-hover:text-white text-xl duration-500">Upload CSV</span>
            <span className="absolute w-full h-full bg-green-500 -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500"></span>
            <span className="absolute w-full h-full bg-green-500 -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500"></span>
          </button>
        </FileUpload>
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
                className="mb-4 p-2 border rounded mr-2"
              >
                <option value="">Select a column for chart</option>
                {headers.map((header) => (
                  <option key={header} value={header}>{header}</option>
                ))}
              </select>
              <select 
                onChange={(e) => setChartType(e.target.value)}
                className="mb-4 p-2 border rounded"
              >
                <option value="chord">Chord Diagram</option>
                <option value="bubble">Bubble Chart</option>
              </select>
              <button
                onClick={() => {/* Add your logic here */}}
                className="relative px-8 py-2 rounded-md bg-white isolation-auto z-10 border-2 border-red-700 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-[#A12347] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                Choose File
              </button>
              {selectedColumn && <Chart data={csvData} column={selectedColumn} chartType={chartType} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}