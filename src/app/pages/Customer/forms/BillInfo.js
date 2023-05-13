import { useState, useEffect } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TableHead, Box, Stack, styled, IconButton,
    Table, TableBody, TableCell, TablePagination, TableContainer, TableRow, Chip
} from "@mui/material";
import EastIcon from '@mui/icons-material/East';
import { convertToDateTimeStr } from "../../../utils/utils";

const StyledIconBtn = styled(IconButton)(({ theme }) => ({
    height: 44,
    whiteSpace: 'pre',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
    '& .icon': {
        width: 36,
        fontSize: '18px',
        paddingLeft: '16px',
        paddingRight: '16px',
        verticalAlign: 'middle',
    },
}));

const BillInfo = ({ data }) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleViewDetail = (id) => {
        navigate("/order/" + id);
    }

    return (
        data && data.length !== 0 &&
        <Box>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã đơn</TableCell>
                            <TableCell align="center">Ngày đặt</TableCell>
                            <TableCell align="center">Tình trạng</TableCell>
                            <TableCell align="center">Người đặt</TableCell>
                            <TableCell align="center">Tùy chọn</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((order, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row" sx={{ fontWeight: { fontWeight: "bold" } }}>
                                            {order.number}
                                        </TableCell>
                                        <TableCell align="center">
                                            {convertToDateTimeStr(order, "createdAt", true)}
                                        </TableCell>
                                        <TableCell align="center">

                                            {
                                                order.status === 4
                                                    ? <Chip label="Đã nhận đơn" color="warning" />
                                                    : order.status === 3
                                                        ? <Chip label="Đã duyệt" color="secondary" />
                                                        : order.status === 2
                                                            ? <Chip label="Đang giao" color="primary" />
                                                            : order.status === 1
                                                                ? <Chip label="Đã gửi hàng" color="success" />
                                                                : <Chip label="Đã hủy" color="error" />
                                            }
                                        </TableCell>
                                        <TableCell align="center">{order.user.firstName + " " + order.user.lastName}</TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                {/* <Button aria-label="edit" onClick={() => handleOpenEdit(row.id)}>
                                                    <EditIcon />
                                                </Button> */}
                                                <StyledIconBtn aria-label="east" onClick={() => handleViewDetail(order.id)}>
                                                    <EastIcon />
                                                </StyledIconBtn>
                                            </Stack>
                                        </TableCell>
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

export default BillInfo;