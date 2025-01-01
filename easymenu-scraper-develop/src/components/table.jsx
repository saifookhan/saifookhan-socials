import React, { useEffect, useState } from "react";
import styled from "styled-components";

const TableContainer = styled.div`
  max-width: 100%;
  padding: 10px;
  margin: 20px;
  font-family: Arial, sans-serif;
  overflow-x: auto; /* Allow horizontal scrolling if needed */
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%; /* Ensure the table takes the full width of the container */
`;

const BtnDiv = styled.div`
  width: 100%;
  margin: auto;
  display: flex;
  text-align: space-around;
  padding: 20px 0px;
`;

const Btn = styled.div`
  background: #4caf50;
  margin: auto;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 10px;
  color: white;
`;

const TableCell = styled.td`
  max-width: 100px;
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  overflow: hidden; /* Hide overflow content */
  white-space: nowrap; /* Prevent text from wrapping */
  text-overflow: ellipsis; /* Add ellipsis (...) for overflowed text */
  color: #000;
`;

const TableRow = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }

  /* Change background color for the first row */
  &:first-of-type {
    background-color: #4caf50; /* Background color for the first row */
    color: white; /* Text color for the first row */
  }
`;

const Table = ({ data }) => {
  const [restaurantData, setRestaurantData] = useState([]); // Initialize as an empty array

  useEffect(() => {
    // Always treat data as an array
    setRestaurantData((prevData) => [
      ...prevData,
      ...(Array.isArray(data) ? data : [data]),
    ]);
  }, [data]);

  return (
    <TableContainer>
      <h2 style={{ color: "white" }}>Restaurant Data</h2>
      <StyledTable>
        <tbody>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Image Urls</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Website</TableCell>

            {/* <TableCell>Website</TableCell>
            <TableCell>Opening Time</TableCell> */}
          </TableRow>

          {restaurantData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.address}</TableCell>
              <TableCell>
                {data.menuPhotos ? data.menuPhotos[0] : "No Photos"}
              </TableCell>
              <TableCell>
                {data.phone ? data.phone : "No Phone Number"}
              </TableCell>
              <TableCell>
                {data.website ? data.website : "No Website"}
              </TableCell>

              {/* <TableCell>{data.website}</TableCell> Uncommented to display website */}
              {/* <TableCell>{data.opening}</TableCell> Uncommented to display opening time */}
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
      <BtnDiv>
        <Btn>Push Data</Btn>
        <Btn>Visit</Btn>
        <Btn>View JSON</Btn>
      </BtnDiv>
    </TableContainer>
  );
};

export default Table; // Ensure to export the renamed component
