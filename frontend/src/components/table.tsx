import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import { ContactSchema } from "../types/contact.models";
import { axiosInstance } from "../utils/axios.utils";

export default function BasicTable() {
  const [contactList, setContactList] = useState([]);
  const getList = () => {
    axiosInstance.get("/api/contacts").then((res) => {
      setContactList(res.data.data.contacts);
    });
  };

  useEffect(() => getList, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Gender</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>ID</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactList.map((row: ContactSchema & { _id: string }, index) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell>{row.gender}</TableCell>
              <TableCell>{row.phone}</TableCell>
              <TableCell>{row._id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <input type="button" value="Refresh list" onClick={getList} />
    </TableContainer>
  );
}
