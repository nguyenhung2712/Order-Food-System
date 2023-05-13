import { useRef, useState } from 'react';
import React from 'react';
import {
    Box, styled, Button, IconButton, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { withStyles } from '@mui/styles';
import { H4, H5, Paragraph, Span } from "../../../components/Typography";
import { convertToVND } from "../../../utils/utils";
import PrintIcon from '@mui/icons-material/Print';

import ReactToPrint from 'react-to-print';

const StyledTableHead = withStyles(theme => ({
    root: {
        backgroundColor: '#FAFAFA'
    }
}))(TableHead);


const OrderInfo = ({ data }) => {
    const navigate = useNavigate();
    const printRef = useRef();

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <IconButton
                    sx={{ height: "40px" }}
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIcon />
                </IconButton>
                <ReactToPrint
                    trigger={() => <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        sx={{ my: 2 }}
                    >
                        <PrintIcon />
                    </Button>}
                    content={() => printRef.current}
                />
            </Box >
            <Box ref={printRef} sx={{ padding: "12px " }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px"
                    }}
                >
                    <Box>
                        <H4>Thông tin đơn hàng</H4>
                        <Paragraph
                            sx={{ fontSize: "14px", marginBottom: "16px" }}
                        >Mã đơn</Paragraph>
                        <Paragraph
                            sx={{ fontSize: "14px", margin: 0 }}
                        ># {data.number}</Paragraph>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <H4>
                            Tình trạng đơn: <Span sx={{ fontWeight: "normal" }}>{data.status}</Span>
                        </H4>
                        <H4>Ngày đặt: <Span sx={{ fontWeight: "normal" }}>{data.createdAt}</Span></H4>
                    </Box>
                </Box>
                <Divider />
                <Box>
                    <H4
                        sx={{
                            "marginTop": "0px",
                            "fontWeight": "500",
                            "lineHeight": "1.5",
                            "textTransform": "none",
                            "fontSize": "15px",
                            "marginBottom": "8px"
                        }}
                    >Thông tin giao hàng</H4>
                    <Paragraph
                        sx={{ "marginTop": "0px", "fontSize": "16px", "textTransform": "none", "marginBottom": "16px" }}
                    >{data.titleAddress}</Paragraph>
                    <Paragraph>{data.email}</Paragraph>
                    <Paragraph>
                        {data.street}</Paragraph>
                    <Paragraph>+84{data.phone.slice(1)}</Paragraph>
                </Box>
                <TableContainer sx={{ marginTop: "16px" }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <StyledTableHead>
                            <TableRow>
                                <TableCell align="left" sx={{
                                    paddingLeft: "24px !important"
                                }}>#</TableCell>
                                <TableCell align="center">Tên</TableCell>
                                <TableCell align="center">Giá</TableCell>
                                <TableCell align="center">Số lượng</TableCell>
                                <TableCell align="center">Tổng</TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {data.details.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="left" sx={{
                                        paddingLeft: "24px !important"
                                    }}>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell align="center">{row.dish.dishName}</TableCell>
                                    <TableCell align="center">{convertToVND(Number(row.price))}</TableCell>
                                    <TableCell align="center">{row.quantity}</TableCell>
                                    <TableCell align="center">{convertToVND(Number(row.price) * row.quantity)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ "padding": "8px 16px", "maxWidth": "300px", "marginLeft": "auto" }}>
                    <Box sx={{ "display": "flex", "WebkitBoxAlign": "center", "alignItems": "center", "WebkitBoxPack": "justify", "justifyContent": "space-between" }}>
                        <H5 sx={{ "marginBottom": "0px", "marginTop": "0px", "fontSize": "14px", "fontWeight": "500", "lineHeight": "1.5", "textTransform": "none" }}>Tổng:</H5>
                        <H5 sx={{ "marginBottom": "0px", "marginTop": "0px", "fontSize": "14px", "fontWeight": "500", "lineHeight": "1.5", "textTransform": "none" }}>
                            {convertToVND(data.details.reduce((acc, detail) => acc + detail.quantity * Number(detail.price), 0))}
                        </H5>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default OrderInfo