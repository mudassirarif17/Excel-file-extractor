import React, { useState } from 'react';
// import XLSX from 'xlsx';
import * as XLSX from 'xlsx/xlsx.mjs';
import { read, writeFileXLSX } from "xlsx";

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  // Handle file upload and data extraction from Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // Assuming the first row contains column titles
      const columns = excelData[0];
      const formattedData = excelData.slice(1).map((row) => {
        const rowData = {};

        columns.forEach((column, index) => {
          rowData[column] = row[index];
        });

        return rowData;
      });

      setData(formattedData);
    };

    reader.readAsBinaryString(file);
  };

  // Handle pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Handle search
  const filteredItems = currentItems.filter((item) => {
    return Object.values(item).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      <h1>Excel Data Viewer</h1>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" />

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Project Description</th>
            <th>Technology Used</th>
            <th>Faculty</th>
            <th>Project Category</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item['Project Title']}</td>
              <td>{item['Project Description']}</td>
              <td>{item['Technology Used']}</td>
              <td>{item['Faculty']}</td>
              <td>{item['Project Category']}</td>
              <td>{item['Remarks']}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <ul className="pagination">
      {pageNumbers.map((number) => (
        <li

 key={number}>
          <button onClick={() => paginate(number)}>{number}</button>
        </li>
      ))}
    </ul>
  );
};

export default App;