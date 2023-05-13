import { useState, useEffect } from "react";
import React from 'react';
import {
    TableHead, Box,
    Table, TableBody, TableCell, TablePagination, TableContainer, TableRow, Chip
} from "@mui/material";

import { convertToDateTimeStr } from "../../../utils/utils";

const LogInfo = ({ data }) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        data && data.length !== 0 &&
        <Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Phương thức</TableCell>
                            <TableCell align="left">Trạng thái</TableCell>
                            <TableCell align="left">API</TableCell>
                            <TableCell align="right">Địa chỉ IP</TableCell>
                            <TableCell align="right">Thời gian</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((log, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: { fontWeight: "bold" } }}>
                                            {log.typeApi}
                                        </TableCell>
                                        <TableCell align="left">
                                            <Chip
                                                label={log.statusCode}
                                                color={log.statusCode[0] === "4" ? "error" : "success"}
                                                sx={{ borderRadius: "8px" }}
                                            />
                                        </TableCell>
                                        <TableCell align="left">{log.apiText}</TableCell>
                                        <TableCell align="right">{log.ipAddress}</TableCell>
                                        <TableCell align="right">{convertToDateTimeStr(log, "createdAt")}</TableCell>
                                    </TableRow>
                                ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Dòng dữ liệu trên trang"}
            />
        </Box>
    );
}

export default LogInfo;