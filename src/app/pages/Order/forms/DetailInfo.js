import { useRef, useState, useEffect } from 'react';
import React from 'react';
import {
    Box, styled, Button, IconButton, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField, InputAdornment, Grid, CardMedia, Pagination
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { withStyles } from '@mui/styles';
import { H4, H5, H6, Paragraph, Span } from "../../../components/Typography";
import { convertToVND, convertToDateTimeStr } from "../../../utils/utils";
import SearchIcon from '@mui/icons-material/Search';
import PrintIcon from '@mui/icons-material/Print';
import ReactToPrint from 'react-to-print';

/* const StyledTableHead = withStyles(theme => ({
    root: {
        backgroundColor: '#FAFAFA'
    }
}))(TableHead); */

const itemsPerPage = 5;

const DetailInfo = ({ data }) => {
    const navigate = useNavigate();
    const printRef = useRef();
    const [page, setPage] = useState(1);
    const [filteredDetails, setFilteredDetails] = useState([]);
    const [isFiltered, setFiltered] = useState(false);
    const [filterText, setFilterText] = useState("");
    console.log(data)

    useEffect(() => {
        (async () => {
            if (data.details) {
                setFilteredDetails(data.details.filter(detail =>
                    detail.dish.dishName.toLowerCase().indexOf(filterText.toLowerCase()) > -1
                    || detail.price.indexOf(filterText.toLowerCase()) > -1
                    || detail.quantity.toString().indexOf(filterText.toLowerCase()) > -1
                    || ((Number(detail.price)) * detail.quantity).toString().indexOf(filterText.toLowerCase()) > -1
                ));
            }
        })()
    }, [filterText])

    return (
        <>
            {/* <Box
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
            </Box > */}
            <Box sx={{ position: "absolute", top: "24px", right: "24px" }}>
                <Paragraph sx={{ color: "rgba(52, 49, 76, 0.54)", fontSize: "14px" }}>
                    {data.createdAtTime}
                </Paragraph>
            </Box>
            <Divider />
            <Box
                sx={{
                    margin: "18px 0",
                    display: "flex"
                }}
            >
                <TextField
                    id="filter"
                    placeholder="Tìm kiếm sản phẩm..."
                    variant="outlined"
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        flexGrow: 1
                    }}
                    onChange={(event) => {
                        setFiltered(event.target.value !== "" ? true : false);
                        setFilterText(event.target.value);
                    }}
                />
            </Box>
            <Box sx={{ minWidth: "600px" }}>
                <Box sx={{ padding: "12px 0" }}>
                    <Grid container spacing={0}>
                        <Grid item lg={6} md={6} sm={6} xs={6}>
                            <H6>Thông tin chi tiết</H6>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2}>
                            <H6>Giá</H6>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2}>
                            <H6>Số lượng</H6>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={2}>
                            <H6>Tổng</H6>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            <Divider />
            {
                !isFiltered
                    ? data.details
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                        .map((row, index) => (
                            <Box sx={{ minWidth: "600px" }} key={index}>
                                <Box sx={{ padding: "12px 0" }}>
                                    <Grid container spacing={0} sx={{ display: "flex", alignItems: "center" }}>
                                        <Grid item lg={6} md={6} sm={6} xs={6}>
                                            <Box sx={{ display: "flex" }}>
                                                <CardMedia
                                                    component="img"
                                                    sx={{
                                                        "width": "100px",
                                                        "borderRadius": "4px",
                                                        "marginRight": "12px"
                                                    }}

                                                    image={
                                                        row.dish.image
                                                            .split('|')
                                                            .filter((image) => image !== '')[0]
                                                    }
                                                    alt="Product image"
                                                />
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <H6
                                                        sx={{
                                                            "marginTop": "0px",
                                                            "fontWeight": "500",
                                                            "lineHeight": "1.5",
                                                            "textTransform": "none",
                                                            "marginBottom": "12px",
                                                            "fontSize": "15px",
                                                            "color": "#6A75C9"
                                                        }}
                                                    >{row.dish.dishName}</H6>
                                                    <Paragraph
                                                        sx={{
                                                            "textTransform": "none",
                                                            "marginTop": "0px",
                                                            "fontSize": "13px",
                                                            "marginBottom": "6px"
                                                        }}
                                                    >{row.dish.dishNameEn}</Paragraph>
                                                    <Paragraph
                                                        sx={{
                                                            "textTransform": "none",
                                                            "marginTop": "0px",
                                                            "fontSize": "13px",
                                                            "marginBottom": "6px"
                                                        }}
                                                    ><Span sx={{ color: "rgba(52, 49, 76, 0.54)" }}>Loại: </Span>{row.dish.type.typeName}</Paragraph>


                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                            <H6>{convertToVND(row.price)}</H6>
                                        </Grid>
                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                            <H6>{row.quantity}</H6>
                                        </Grid>
                                        <Grid item lg={2} md={2} sm={2} xs={2}>
                                            <H6>{convertToVND(row.price * row.quantity)}</H6>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        ))
                    : filteredDetails.map((row, index) => (
                        <Box sx={{ minWidth: "600px" }} key={index}>
                            <Box sx={{ padding: "12px 0" }}>
                                <Grid container spacing={0} sx={{ display: "flex", alignItems: "center" }}>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Box sx={{ display: "flex" }}>
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    "width": "100px",
                                                    "borderRadius": "4px",
                                                    "marginRight": "12px"
                                                }}

                                                image={
                                                    row.dish.image
                                                        .split('|')
                                                        .filter((image) => image !== '')[0]
                                                }
                                                alt="Product image"
                                            />
                                            <Box sx={{ flexGrow: 1 }}>
                                                <H6
                                                    sx={{
                                                        "marginTop": "0px",
                                                        "fontWeight": "500",
                                                        "lineHeight": "1.5",
                                                        "textTransform": "none",
                                                        "marginBottom": "12px",
                                                        "fontSize": "15px",
                                                        "color": "#6A75C9"
                                                    }}
                                                >{row.dish.dishName}</H6>
                                                <Paragraph
                                                    sx={{
                                                        "textTransform": "none",
                                                        "marginTop": "0px",
                                                        "fontSize": "13px",
                                                        "marginBottom": "6px"
                                                    }}
                                                >{row.dish.dishNameEn}</Paragraph>
                                                <Paragraph
                                                    sx={{
                                                        "textTransform": "none",
                                                        "marginTop": "0px",
                                                        "fontSize": "13px",
                                                        "marginBottom": "6px"
                                                    }}
                                                ><Span sx={{ color: "rgba(52, 49, 76, 0.54)" }}>Loại: </Span>{row.dish.type.typeName}</Paragraph>


                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <H6>{convertToVND(row.price)}</H6>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <H6>{row.quantity}</H6>
                                    </Grid>
                                    <Grid item lg={2} md={2} sm={2} xs={2}>
                                        <H6>{convertToVND(row.price * row.quantity)}</H6>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    ))
            }
            <Box
                sx={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {
                    !isFiltered &&
                    <Pagination
                        count={Math.ceil(data.details.length / itemsPerPage)}
                        page={page}
                        onChange={(event, val) => setPage(val)}
                        defaultPage={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                }
            </Box>
            <Divider sx={{ margin: "24px 0 16px" }} />
            <Grid container spacing={6} /* sx={{ display: "flex", alignItems: "center" }} */>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                    <H5 sx={{ marginBottom: "24px" }}>Ghi chú</H5>
                    <Paragraph>{data.note}</Paragraph>
                </Grid>
                <Grid item lg={4} md={4} sm={4} xs={12}>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Paragraph sx={{ color: "rgba(52, 49, 76, 0.54)" }}>Tổng:</Paragraph>
                        <Paragraph>{data.details && convertToVND(data.details.reduce((acc, detail) => acc + Number(detail.price) * detail.quantity, 0))}</Paragraph>
                    </Box>
                </Grid>
            </Grid>
            {/* <Box ref={printRef} sx={{ padding: "12px " }}>
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
            </Box> */}
        </>
    )
}

export default DetailInfo;