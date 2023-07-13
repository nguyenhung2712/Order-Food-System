import { useState, useEffect } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Skeleton, styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow,
    Toolbar, Tooltip, CircularProgress, Backdrop
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';

import swal from 'sweetalert';

import { getComparator, stableSort } from "../../../utils/utils";
import { SortTableHead } from "../../../components";

import StaffService from "../../../services/staff.service";
import { update } from "../../../redux/actions/StaffActions";

const headCells = [
    {
        id: 'username',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài khoản',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Tạo lúc',
    },
];

const Button = styled(IconButton)(({ theme }) => ({
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

const RegisteredTable = ({ rows, setRender }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('username');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
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

    const handleApprove = (event) => {
        let selectedArr = selected;
        swal({
            title: "Xác nhận tài khoản",
            text: "Đồng ý xác nhận tài khoản của nhân viên ?",
            icon: "info",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    setLoading(true);
                    selectedArr.forEach(async (id) => {
                        await StaffService.approveStaff(id)
                            .then(res => {
                                setLoading(false);
                                swal({
                                    title: "Thành công",
                                    text: "Xác nhận tài khoản nhân viên thành công",
                                    icon: "success"
                                });
                                dispatch(update(id, { isActived: 1 }));
                                setSelected([]);
                                setRender(curr => !curr);
                            });
                    });

                }
            });
    }

    const handleViewDetail = (id) => {
        navigate("/staff/" + id);
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
    if (!rows) {
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
                    loading === false
                        ? <Tooltip title="Approve">
                            <IconButton onClick={handleApprove}>
                                <CheckCircleIcon />
                            </IconButton>
                        </Tooltip>
                        : <CircularProgress />
                ) : (
                    <Tooltip title="Filter list">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
            </Toolbar>
            <TableContainer>
                <Table
                    aria-labelledby="tableTitle"
                    size={/* dense ? 'small' :  */'medium'}
                >
                    <SortTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        headCells={headCells}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover={row.status !== 0 ? true : false}
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="left"
                                        >
                                            {row.username}
                                        </TableCell>

                                        <TableCell >
                                            {
                                                row.createdAt.getHours() + ':' + row.createdAt.getMinutes() + " " +
                                                row.createdAt.getUTCDate() + "/" +
                                                (row.createdAt.getUTCMonth() + 1) + "/" +
                                                row.createdAt.getUTCFullYear()
                                            }
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
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                labelRowsPerPage={"Dòng dữ liệu trên trang"}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    ".MuiTablePagination-selectLabel": {
                        margin: "0px !important",
                    },
                    ".MuiTablePagination-displayedRows": {
                        margin: "0px !important",
                    },
                }}
            />
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default RegisteredTable;