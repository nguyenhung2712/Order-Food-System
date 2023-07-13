import { useState, useEffect, useRef } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Chip, Typography, Table, TableBody, TableCell, useTheme,
    TablePagination, TableRow, Stack, Toolbar, Tooltip, Button,
    TextField, Skeleton
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';

import { convertToDateTimeStr, getComparator, stableSort, sweetAlert, toastify } from "../../utils/utils";
import { SortTableHead } from "../../components";
import OrderService from "../../services/order.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { addDocument } from '../../services/firebase/service';

const headCells = [
    {
        id: 'number',
        numeric: false,
        disablePadding: true,
        label: 'Mã đơn',
    },
    {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Đặt lúc',
    },
    {
        id: 'predictDate',
        numeric: true,
        disablePadding: false,
        label: 'Giao lúc',
    },
    {
        id: 'username',
        numeric: true,
        disablePadding: false,
        label: 'Người đặt',
    },
    {
        id: 'status',
        numeric: true,
        disablePadding: false,
        label: 'Tình trạng',
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Xem',
    },
];

export default function OrderTable({ onSetProgress, onSetLoading }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { palette } = useTheme();

    const [anchorEl, setAnchorEl] = useState(null);
    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;
    const [filteredRows, setFilteredRows] = useState();
    const [filterText, setFilterText] = useState('');

    const [rows, setRows] = useState();
    const [state, setState] = useState();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('dishName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        onSetLoading(true);
        (async () => {
            await OrderService.getAllOrders({
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    onSetProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            onSetLoading(false);
                        }, 600);
                    }
                },
            })
                .then((res) => {
                    let orders = res.data.payload;
                    let rows = orders.map(order => ({
                        id: order.id,
                        number: order.number,
                        createdAt: new Date(order.createdAt),
                        predictDate: new Date(order.predictDate),
                        username: order.user.firstName + " " + order.user.lastName,
                        status: order.status,
                        user: order.user
                    }));
                    setFilteredRows(rows);
                    setRows(rows);
                    setState(orders);
                })
                .catch((err) => {
                    console.log(err);
                });
        })();
    }, [isRender]);

    useEffect(() => {
        if (filterText === "") {
            setFilteredRows(rows);
        } else {
            setFilteredRows(rows.filter((row) => {
                let type = "";
                switch (row.status) {
                    case 4: type = "Đã nhận đơn"; break;
                    case 3: type = "Đã duyệt"; break;
                    case 2: type = "Đang giao"; break;
                    default: type = "Đã giao"; break;
                }
                return row.number.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    row.username.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    type.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                    convertToDateTimeStr(row, "predictDate", true).indexOf(filterText.toLowerCase()) > -1 ||
                    convertToDateTimeStr(row, "createdAt", true).indexOf(filterText.toLowerCase()) > -1
            }))
        }
    }, [filterText]);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.filter((n) => n.status !== 0)/* .map((n) => n.id) */;
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

    const handleViewDetail = (id) => {
        navigate("/order/" + id);
    }

    const handleUpdateStatus = async (event, status) => {
        let selectedArr = selected;
        let type = "";
        switch (status) {
            case 4: type = "Đã nhận đơn"; break;
            case 3: type = "Đã duyệt"; break;
            case 2: type = "Đang giao"; break;
            default: type = "Đã giao"; break;
        }
        sweetAlert({
            title: 'Cập nhật tình trạng',
            text: `Đồng ý cập nhật đơn hàng sang trạng thái ${type}?`,
            icon: 'info',
            confirmColor: primaryColor,
            cancelColor: errorColor,
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    selectedArr.forEach(async (row) => {
                        await OrderService.updateOrder(row.id, { status })
                            .then(async (res) => {
                                await addDocument("notifications", {
                                    title: "Cập nhật đơn hàng",
                                    message: `Đơn hàng ${row.number} đã được cập nhật trạng thái thành ${type}`,
                                    usePath: "/my-account/orders",
                                    staffPath: null,
                                    readBy: [],
                                    image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216317/invoice.png",
                                    receivedId: [row.user.id],
                                    status: 1
                                });
                                toastify({
                                    message: "Đã cập nhật trạng thái đơn hàng",
                                    position: "top-right",
                                    type: "success"
                                });
                                setIsRender(curr => !curr);
                            });
                    });
                    setSelected([]);
                }
            });
    }

    const handleDelete = (event) => {
        let selectedArr = selected;
        sweetAlert({
            title: "Xóa đơn hàng",
            text: "Đồng ý xóa các đơn hàng đã chọn ?",
            icon: "warning",
            confirmColor: primaryColor,
            cancelColor: errorColor,
        })
            .then(result => {
                if (result.isConfirmed) {
                    selectedArr.forEach(async (row) => {
                        await OrderService.deleteOrder(row.id)
                            .then(async (res) => {
                                await addDocument("notifications", {
                                    title: "Cập nhật đơn hàng",
                                    message: `Đơn hàng ${row.number} đã được tạm khóa. Hãy liên hệ nhân viên để biết thêm chi tiết.`,
                                    usePath: "/my=account/orders",
                                    readBy: [],
                                    image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216317/invoice.png",
                                    receivedId: [row.user.id],
                                    status: 1
                                });
                                setIsRender(curr => !curr);
                            });
                    });
                    toastify({
                        message: "Đã tạm xóa các đơn hàng",
                        position: "top-right",
                        type: "success"
                    });
                    setSelected([]);
                }
            });
    }

    const isSelected = (name) => selected.map(select => select.id).indexOf(name) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    if (!rows || !filteredRows) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"550px"}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ width: '100%', position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "center", position: "absolute", top: "-55px", right: "4px" }}>
                <TextField
                    label="Tìm kiếm"
                    size="small"
                    sx={{
                        marginRight: "14px",
                        width: "220px"
                    }}
                    value={filterText}
                    onChange={handleFilterChange}
                />
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{
                        my: 1,
                        fontSize: "1rem",
                        borderRadius: "6px !important",
                        border: 1
                    }}
                >
                    <CSVLink
                        data={filteredRows}
                        filename={"orders-data.csv"}
                        target="_blank"
                        style={{ display: 'flex', alignItems: 'center', textDecoration: "none", color: "#fff" }}
                    >
                        <FileDownloadIcon />
                    </CSVLink>
                </Button>
            </Box>
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

                {
                    selected.length > 0 && (
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Đã tiếp nhận">
                                <IconButton onClick={(e) => handleUpdateStatus(e, 4)}>
                                    <CallReceivedIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Đã xác nhận">
                                <IconButton onClick={(e) => handleUpdateStatus(e, 3)}>
                                    <HowToRegIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Đang vận chuyển">
                                <IconButton onClick={(e) => handleUpdateStatus(e, 2)}>
                                    <LocalShippingIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Đã giao">
                                <IconButton onClick={(e) => handleUpdateStatus(e, 1)}>
                                    <CheckCircleIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy">
                                <IconButton onClick={handleDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    )
                }
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
                        rowCount={filteredRows.filter((n) => n.status !== 0).length}
                        headCells={headCells}
                    />
                    <TableBody>
                        {
                            stableSort(filteredRows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover={row.status !== 0 ? true : false}
                                            onClick={(event) => row.status !== 0 ? handleClick(event, row) : {}}
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
                                                {row.number}
                                            </TableCell>
                                            <TableCell
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align="center"
                                            >
                                                {convertToDateTimeStr(row, "createdAt", true)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {convertToDateTimeStr(row, "predictDate", true)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.username}
                                            </TableCell>
                                            <TableCell align="center">
                                                {
                                                    row.status === 4
                                                        ? <Chip label="Đã nhận đơn" color="warning" size="small" />
                                                        : row.status === 3
                                                            ? <Chip label="Đã duyệt" color="secondary" size="small" />
                                                            : row.status === 2
                                                                ? <Chip label="Đang giao" color="primary" size="small" />
                                                                : row.status === 1
                                                                    ? <Chip label="Đã gửi hàng" color="success" size="small" />
                                                                    : <Chip label="Đã hủy" color="error" size="small" />
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {/* <Button aria-label="edit" onClick={() => handleOpenEdit(row.id)}>
                                                    <EditIcon />
                                                </Button> */}
                                                    <IconButton aria-label="east" onClick={() => handleViewDetail(row.id)}>
                                                        <EastIcon />
                                                    </IconButton>
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
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage={"Dòng dữ liệu trên trang"}
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from} - ${to} của ${count}`;
                }}
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
