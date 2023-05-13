import React, { useState, useEffect, useRef } from "react";
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
import UserService from "../../services/user.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import EditIcon from '@mui/icons-material/Edit';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Tên',
    },
    {
        id: 'address',
        numeric: true,
        disablePadding: false,
        label: 'Địa chỉ',
    },
    {
        id: 'email',
        numeric: true,
        disablePadding: false,
        label: 'Email',
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
            await UserService.getAllUsers()
                .then(res => {
                    let users = res.data.payload;
                    let rows = users.map(user => ({
                        id: user.id,
                        avatar: user.avatar,
                        name: user.firstName + " " + user.lastName,
                        email: user.email,
                        status: user.status,
                        address: user.UserAddresses[0].address
                            ? user.UserAddresses[0].address.address
                            + ", " + user.UserAddresses[0].address.ward.wardName
                            + " - " + user.UserAddresses[0].address.district.districtName
                            + " - " + user.UserAddresses[0].address.province.provinceName
                            : <i>Người dùng chưa cung cấp</i>
                    }));
                    setRows(rows);
                    setState(users);
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

    const handleOpenEdit = (id) => {
        navigate("/customer/edit/" + id);
    }

    const handleViewDetail = (id) => {
        navigate("/customer/" + id);
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
                        await UserService.updateUser(id, { status: 0 })
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

    const handleUpdateStatus = async (event, id) => {
        console.log(id);
        /* const { status } = event.currentTarget.dataset;
        await OrderService.updateOrder(id, { status: Number(status) })
            .then(res => {
                setIsRender(curr => !curr);
            });
        setOpenAction(false); */
    }
    console.log(state);
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
                            data={state}
                            filename={"customers-data.csv"}
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
                                        <TableCell component="th" sx={{ wordBreak: "normal !important" }}>
                                            <CardMedia
                                                sx={{
                                                    height: 35,
                                                    width: 35,
                                                    objectFit: "fit",
                                                    borderRadius: "50%",
                                                    display: "inline-block",
                                                    verticalAlign: "middle"
                                                }}
                                                component="span"
                                                image={row.avatar}
                                                title="green iguana"
                                            /> {row.name}
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="center"
                                            sx={{
                                                wordBreak: "normal !important"
                                            }}
                                        >
                                            {row.address}
                                        </TableCell>
                                        <TableCell align="center">
                                            {row.email}
                                        </TableCell>
                                        <TableCell align="center">
                                            {
                                                row.status === 2
                                                    ? <Chip label="Tạm đình chỉ" color="warning" />
                                                    : row.status === 1
                                                        ? <Chip label="Bình thường" color="info" />
                                                        : <Chip label="Tạm xóa" />
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

