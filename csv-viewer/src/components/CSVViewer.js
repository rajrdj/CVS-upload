import React, { useState, useEffect } from 'react';

const CSVViewer = ({ data, headers }) => {
  const [displayData, setDisplayData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 100;

  useEffect(() => {
    setDisplayData(data);
  }, [data]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = data.filter(row => 
      Object.values(row).some(value => 
        value.toString().toLowerCase().includes(term)
      )
    );
    setDisplayData(filtered);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    const direction = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
    const sorted = [...displayData].sort((a, b) => {
      if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setDisplayData(sorted);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = displayData.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded"
      />
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(header => (
              <th
                key={header}
                onClick={() => handleSort(header)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                {header}
                {sortColumn === header && (sortDirection === 'asc' ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentRecords.map((row, index) => (
            <tr key={index}>
              {headers.map(header => (
                <td key={header} className="px-6 py-4 whitespace-nowrap">{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {Array.from({ length: Math.ceil(displayData.length / recordsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className="mx-1 px-3 py-1 border rounded hover:bg-gray-200"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};


export default CSVViewer;