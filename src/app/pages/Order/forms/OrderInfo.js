import { useRef } from 'react';
import React from 'react';
import {
    Box, Chip, Button, Divider, Skeleton, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import { H4, H5, Paragraph, Span, H3 } from "../../../components/Typography";
import { convertToVND } from "../../../utils/utils";
import PrintIcon from '@mui/icons-material/Print';
import { Breadcrumb, SimpleCard } from "../../../components";

import ReactToPrint from 'react-to-print';

const StyledTableHead = withStyles(theme => ({
    root: {
        backgroundColor: '#FAFAFA'
    }
}))(TableHead);


const OrderInfo = ({ data }) => {
    const navigate = useNavigate();
    const printRef = useRef();

    if (!data) {
        return (
            //Chỉnh sửa lại....
            <SimpleCard title="Thông tin sản phẩm">
                <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ width: "100%", marginBottom: "12px" }}>
                            <Skeleton
                                variant="rounded" width={"100%"}
                                height={"450px"}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>

                    </Grid>
                </Grid>
            </SimpleCard>
        );
    }

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}
            >
                <H3 sx={{ marginBottom: "8px" }}>Thông tin đơn hàng</H3>
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

                        <H4
                            sx={{ fontSize: "16px", marginBottom: "10px" }}
                        >Mã đơn</H4>
                        <Paragraph
                            sx={{ fontSize: "14px", margin: 0 }}
                        ># {data.number}</Paragraph>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                        <H4 sx={{ marginBottom: "8px" }}>
                            Tình trạng đơn: <Span sx={{ fontWeight: "normal" }}>
                                {
                                    data.status === 4
                                        ? <Chip label="Đã nhận đơn" color="warning" size="small" />
                                        : data.status === 3
                                            ? <Chip label="Đã duyệt" color="secondary" size="small" />
                                            : data.status === 2
                                                ? <Chip label="Đang giao" color="primary" size="small" />
                                                : data.status === 1
                                                    ? <Chip label="Đã gửi hàng" color="success" size="small" />
                                                    : <Chip label="Đã hủy" color="error" size="small" />
                                }
                            </Span>
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
                            "margin": "8px 0 10px"
                        }}
                    >Thông tin giao hàng</H4>
                    <Paragraph
                        sx={{ "marginTop": "0px", "fontSize": "16px", "textTransform": "none", "marginBottom": "16px" }}
                    >{data.titleAddress}</Paragraph>
                    <H5 sx={{ marginBottom: "8px" }}>Địa chỉ mail: <Paragraph sx={{ fontWeight: 400, display: "inline", fontSize: "14px" }}>{data.email}</Paragraph>
                    </H5>
                    <H5 sx={{ marginBottom: "8px" }}>Địa chỉ giao: <Paragraph sx={{ fontWeight: 400, display: "inline", fontSize: "14px" }}>{data.street}</Paragraph>
                    </H5>
                    <H5 sx={{ marginBottom: "8px" }}>Điện thoại liên lạc: {data.phone && <Paragraph sx={{ fontWeight: 400, display: "inline", fontSize: "14px" }}>{"+84" + data.phone.slice(1)}</Paragraph>}
                    </H5>
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