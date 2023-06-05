import { useState, useEffect } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, CardMedia, Chip,
    styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack,
    Toolbar, Tooltip, Button
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';

import swal from 'sweetalert';

import { convertToVND, getComparator, stableSort } from "../../utils/utils";
import { SortTableHead, Chatbox, ChatHead, ChatAvatar } from "../../components";
import ProductService from "../../services/product.service";
import { init, unable } from "../../redux/actions/ProductActions";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import StarIcon from '@mui/icons-material/Star';

const headCells = [
    {
        id: 'image',
        numeric: false,
        disablePadding: true,
        label: 'Hình ảnh',
    },
    {
        id: 'dishName',
        numeric: true,
        disablePadding: false,
        label: 'Tên món',
    },
    {
        id: 'rating',
        numeric: true,
        disablePadding: false,
        label: 'Đánh giá',
    },
    {
        id: 'price',
        numeric: true,
        disablePadding: false,
        label: 'Giá bán',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Tình trạng',
    },
    {
        id: 'quantity',
        numeric: true,
        disablePadding: false,
        label: 'Số lượng',
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Tác vụ',
    },
];

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

export default function EnhancedTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [products, setProducts] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('dishName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        (async () => {
            await ProductService.getAllProducts()
                .then((res) => {
                    let products = res.data.payload;
                    console.log(products);
                    products.forEach(product => {
                        let imageArr = product.image.split("|")
                            .filter(image => image !== "");
                        product.image = imageArr;
                        return product;
                    });
                    let rows = products.map(product => ({
                        id: product.id,
                        image: product.image,
                        typeName: product.type.typeName,
                        dishName: product.dishName,
                        status: product.status,
                        quantityLeft: product.quantityLeft,
                        price: product.price,
                        ratings: product.Rates
                    }));
                    setRows(rows);
                    setProducts(products);
                    dispatch(init(products));
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, [isRender]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.filter((n) => n.status !== 0).map((n) => n.id);
            setSelected(newSelected);
            return;
        } else {
            setSelected([]);
        }
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenEdit = (id) => {
        navigate("/product/edit/" + id);
    }

    const handleViewDetail = (id) => {
        navigate("/product/" + id);
    }

    const handleDelete = (event) => {
        let selectedArr = selected;
        swal({
            title: "Xóa nội dung",
            text: "Đồng ý xóa các nội dung đã chọn ?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    selectedArr.forEach(async (id) => {
                        await ProductService.deleteProduct(id)
                            .then(res => {
                                dispatch(unable(id));
                                setIsRender(curr => !curr);
                            });
                    });
                    setSelected([]);
                }
            });
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const round = (value, precision) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                    ...(selected.length > 0 && {
                        bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                    }),
                }}
            >
                {selected.length > 0 ? (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {selected.length} đã chọn
                    </Typography>
                ) : (
                    <Typography
                        sx={{ flex: '1 1 100%' }}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        Danh sách
                    </Typography>
                )}

                {selected.length > 0 ? (
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                ) : (
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        sx={{
                            my: 2,
                            fontSize: "1rem",
                            borderRadius: "6px !important",
                            border: 1
                        }}
                    >
                        <CSVLink
                            data={products}
                            filename={"products-data.csv"}
                            target="_blank"
                            style={{ display: 'flex', alignItems: 'center', textDecoration: "none", color: "#fff" }}
                        >
                            <FileDownloadIcon />
                        </CSVLink>
                    </Button>
                )}
            </Toolbar>
            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={/* dense ? 'small' :  */'medium'}
                >
                    <SortTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.filter((n) => n.status !== 0).length}
                        headCells={headCells}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;
                                let ratingScore = row.ratings.length > 0 ? round(row.ratings.reduce((acc, rating) => acc + Number(rating.score), 0) / row.ratings.length, 2) : 0;

                                return (
                                    <TableRow
                                        hover={row.status !== 0 ? true : false}
                                        onClick={(event) => row.status !== 0 ? handleClick(event, row.id) : {}}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}

                                        sx={row.status === 0 ? { backgroundColor: '#F4F4F5' } : { backgroundColor: '#fff' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                disabled={row.status !== 0 ? false : true}
                                            />
                                        </TableCell>
                                        <TableCell component="th">
                                            <CardMedia
                                                sx={{
                                                    borderColor: 'error.main',
                                                    border: 2, borderRadius: '10px',
                                                    height: 75
                                                }}
                                                image={row.image[0]}
                                                title="Product Image"
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="center"
                                        >
                                            {row.dishName}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                {/* <span
                                                    style={{
                                                        marginRight: "4px",
                                                        fontSize: "16px",
                                                        color: "orange"
                                                    }}
                                                >{ratingScore}</span> */}
                                                {[...Array(5)].map((_, idx) => {
                                                    let widthPercent;
                                                    if (idx + 1 >= ratingScore) {
                                                        if (ratingScore - idx > 0) {
                                                            widthPercent = ((round(ratingScore - idx, 2) + 0.08) * 100).toString() + "%";
                                                        } else {
                                                            widthPercent = "0%";
                                                        }
                                                    }

                                                    return (
                                                        <Box
                                                            sx={{
                                                                position: 'relative'
                                                            }} key={idx}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: idx + 1 < ratingScore ? "100%" : widthPercent,
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    zIndex: 50,
                                                                    overflow: 'hidden'
                                                                }}
                                                            >
                                                                <StarIcon fontSize="small" sx={{ color: "orange" }} />
                                                            </Box>
                                                            <StarIcon fontSize="small" sx={{ color: "gray" }} />
                                                        </Box>
                                                    )
                                                })}
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="center">{convertToVND(row.price)}</TableCell>
                                        <TableCell align="center">
                                            {
                                                row.status === 2
                                                    ? <Chip label="Tạm ẩn" color="error" size="small" />
                                                    : row.status === 0
                                                        ? <Chip label="Tạm xóa" size="small" />
                                                        : row.status === 1 && Number(row.quantityLeft) > 0
                                                            ? <Chip label="Có sẵn" color="primary" size="small" />
                                                            : <Chip label="Hết hàng" color="error" size="small" />
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            {
                                                Number(row.quantityLeft) === 0
                                                    ? <Chip label="Hết hàng" color="error" size="small" />
                                                    : Number(row.quantityLeft) < 30
                                                        ? <Chip label={`Chỉ còn ${row.quantityLeft}`} color="warning" size="small" />
                                                        : <Chip label="Còn hàng" color="primary" size="small" />
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <StyledIconBtn aria-label="edit" onClick={() => handleOpenEdit(row.id)}>
                                                    <EditIcon />
                                                </StyledIconBtn>
                                                <StyledIconBtn aria-label="east" onClick={() => handleViewDetail(row.id)}>
                                                    <EastIcon />
                                                </StyledIconBtn>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        {emptyRows > 0 && (
                            <TableRow
                                style={{
                                    height: (53) * emptyRows,
                                }}
                            >
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Dòng dữ liệu trên trang"}
                sx={{
                    ".MuiTablePagination-selectLabel": {
                        margin: "0px !important",
                    },
                    ".MuiTablePagination-displayedRows": {
                        margin: "0px !important",
                    },

                }}
            />
        </Box>
    );
}
