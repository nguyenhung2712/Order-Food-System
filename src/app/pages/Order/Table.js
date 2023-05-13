import { useState, useEffect, useRef } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, CardMedia, Chip,
    styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack,
    Toolbar, Tooltip, Button, Popper, Fade, Paper, ClickAwayListener, MenuList, MenuItem
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import swal from 'sweetalert';

import { convertToDateTimeStr, getComparator, stableSort } from "../../utils/utils";
import { SortTableHead } from "../../components";
import OrderService from "../../services/order.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

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
    const [anchorEl, setAnchorEl] = useState(null);
    const [rows, setRows] = useState([]);
    const [state, setState] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('dishName');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        (async () => {
            await OrderService.getAllOrders()
                .then((res) => {
                    let orders = res.data.payload;
                    let rows = orders.map(order => ({
                        id: order.id,
                        number: order.number,
                        createdAt: convertToDateTimeStr(order, "createdAt", true),
                        predictDate: convertToDateTimeStr(order, "predictDate", true),
                        username: order.user.firstName + " " + order.user.lastName,
                        status: order.status,
                    }));
                    setRows(rows);
                    setState(orders);
                })
                .catch((err) => {
                    console.log(err);
                });
        })();
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
        swal({
            title: "Thay đổi tình trạng",
            text: `Đồng ý chuyển sang trạng thái ${type}?`,
            icon: "info",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    selectedArr.forEach(async (id) => {
                        await OrderService.updateOrder(id, { status })
                            .then(res => {
                                setIsRender(curr => !curr);
                            });
                    });
                    setSelected([]);
                }
            });
        /* const { status } = event.currentTarget.dataset;
        await OrderService.updateOrder(id, { status: Number(status) })
            .then(res => {
                setIsRender(curr => !curr);
            });
        setOpenAction(false); */
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
                        await OrderService.deleteOrder(id)
                            .then(res => {
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
                    <Stack direction="row" spacing={1} justifyContent="center">
                        <StyledIconBtn onClick={(e) => handleUpdateStatus(e, 4)}>
                            <CallReceivedIcon />
                        </StyledIconBtn>
                        <StyledIconBtn onClick={(e) => handleUpdateStatus(e, 3)}>
                            <HowToRegIcon />
                        </StyledIconBtn>
                        <StyledIconBtn onClick={(e) => handleUpdateStatus(e, 2)}>
                            <LocalShippingIcon />
                        </StyledIconBtn>
                        <StyledIconBtn onClick={(e) => handleUpdateStatus(e, 1)}>
                            <CheckCircleIcon />
                        </StyledIconBtn>
                        <StyledIconBtn onClick={handleDelete}>
                            <DeleteIcon />
                        </StyledIconBtn>
                    </Stack>
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
                            data={state}
                            filename={"orders-data.csv"}
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
                        {
                            stableSort(rows, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row.id);
                                    const labelId = `enhanced-table-checkbox-${index}`;

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
                                                {row.number}
                                            </TableCell>
                                            <TableCell
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                                align="center"
                                            >
                                                {row.createdAt}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.predictDate}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.username}
                                            </TableCell>
                                            {/* <TableCell align="center">{convertToVND(row.price)}</TableCell> */}
                                            <TableCell align="center">
                                                {
                                                    row.status === 4
                                                        ? <Chip label="Đã nhận đơn" color="warning" />
                                                        : row.status === 3
                                                            ? <Chip label="Đã duyệt" color="secondary" />
                                                            : row.status === 2
                                                                ? <Chip label="Đang giao" color="primary" />
                                                                : row.status === 1
                                                                    ? <Chip label="Đã gửi hàng" color="success" />
                                                                    : <Chip label="Đã hủy" color="error" />
                                                }
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="center">
                                                    {/* <Button aria-label="edit" onClick={() => handleOpenEdit(row.id)}>
                                                    <EditIcon />
                                                </Button> */}
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
