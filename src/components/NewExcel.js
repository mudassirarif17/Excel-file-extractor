import React, { useState } from 'react';
// import XLSX from 'xlsx';
import * as XLSX from 'xlsx/xlsx.mjs';

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const filteredItems = currentItems.filter((item) => {
    return Object.values(item).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEdit = (index) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index].editing = true;
      return updatedData;
    });
  };

  const handleSave = (index) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index].editing = false;
      return updatedData;
    });
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    setData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index][name] = value;
      return updatedData;
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Excel Data Viewer</h1>
      <input type="file" onChange={handleFileUpload} accept=".xlsx, .xls" className="mb-3" />

      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="form-control mb-3"
      />

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Project Title</th>
            <th>Project Description</th>
            <th>Technology Used</th>
            <th>Faculty</th>
            <th>Project Category</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item['Project Title']}</td>
              <td>{

item['Project Description']}</td>
              <td>{item['Technology Used']}</td>
              <td>{item['Faculty']}</td>
              <td>{item['Project Category']}</td>
              <td>
                {item.editing ? (
                  <input
                    type="text"
                    name="Remarks"
                    value={item['Remarks']}
                    onChange={(e) => handleInputChange(e, index)}
                    className="form-control"
                  />
                ) : (
                  item['Remarks']
                )}
              </td>
              <td>
                {item.editing ? (
                  <button className="btn btn-primary" onClick={() => handleSave(index)}>
                    Save
                  </button>
                ) : (
                  <button className="btn btn-secondary" onClick={() => handleEdit(index)}>
                    Edit
                  </button>
                )}
              </td>
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
    <nav>
      <ul className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <li className={`page-item ${currentPage === number ? 'active' : ''}`} key={number}>
            <button className="page-link" onClick={() => paginate(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default App;