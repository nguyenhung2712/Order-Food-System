import { useState, useEffect } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Chip,
    styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack,
    Toolbar, Tooltip, CardMedia, Button, useTheme,
    Backdrop, CircularProgress, TextField
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import { convertToDateTimeStr, getComparator, stableSort } from "../../../utils/utils";
import { SortTableHead } from "../../../components";
import BlogService from "../../../services/blog.service";
import { init, unable } from "../../../redux/actions/BlogActions";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { addDocument } from '../../../services/firebase/service';
import { CSVLink } from 'react-csv';

const headCells = [
    {
        id: 'image',
        numeric: false,
        disablePadding: true,
        label: 'Ảnh',
    },
    {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Viết lúc',
    },
    {
        id: 'user',
        numeric: true,
        disablePadding: false,
        label: 'Người viết',
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
    const placeholderImage = `/assets/images/viet-blog-3.jpg`;

    const { palette } = useTheme();
    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [filteredRows, setFilteredRows] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('header');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isRender, setIsRender] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            await BlogService.getAllBlogs()
                .then((res) => {
                    let blogs = res.data.payload;
                    let rows = blogs.map(blog => ({
                        id: blog.id,
                        header: blog.header,
                        user: blog.user.firstName + " " + blog.user.lastName,
                        userId: blog.user.id,
                        status: blog.status,
                        image: getImageUrl(blog.content) ? getImageUrl(blog.content) : placeholderImage,
                        createdAt: convertToDateTimeStr(blog, "createdAt", true)
                    }));
                    setRows(rows);
                    setFilteredRows(rows);
                    dispatch(init(blogs));
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, [isRender]);
    useEffect(() => {
        if (filterText === "") {
            setFilteredRows(rows);
        } else {
            setFilteredRows(rows.filter((row) =>
                row.header.toLowerCase().includes(filterText.toLowerCase()) ||
                row.user.toLowerCase().includes(filterText.toLowerCase())
            ))
        }
    }, [filterText]);

    function getImageUrl(str) {
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        let arrayRes = [];
        str.replace(urlRegex, function (url) {
            arrayRes.push(url.slice(0, url.length - 1));
        });
        return arrayRes[0];
    }

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        console.log(event.target.checked)
        if (event.target.checked) {
            const newSelected = rows.filter((n) => (n.status !== 0 && n.status !== 2)).map((n) => n.id);
            setSelected(newSelected);
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
        navigate("/blog/edit/" + id);
    }

    const handleViewDetail = (id) => {
        navigate("/blog/" + id);
    }

    const handleDelete = (event) => {
        let selectedArr = selected;
        Swal.fire({
            title: 'Xóa blog',
            text: "Xác nhận xóa các blog đã chọn ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: primaryColor,
            cancelButtonColor: errorColor,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(result => {
                if (result.isConfirmed) {
                    setLoading(true);
                    selectedArr.forEach(async (id) => {
                        await BlogService.deleteBlog(id)
                            .then(async (res) => {
                                await addDocument("notifications", {
                                    title: "Cập nhật blog",
                                    message: `Một trong các blog của bạn đã được tạm xóa. Hãy liên hệ nhân viên để biết thêm chi tiết.`,
                                    usePath: "/my-account/blogs",
                                    staffPath: null,
                                    readBy: [],
                                    image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                                    receivedId: [rows.filter(blog => blog.id === id)[0].userId],
                                    status: 1
                                });
                                dispatch(unable(id));
                                setIsRender(curr => !curr);
                            });
                    });
                    setLoading(false);
                    toast.success('Đã xóa blog thành công.', {
                        position: "top-right",
                        autoClose: 2500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: "light",
                    });
                    setSelected([]);
                }
            });
    }

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%', position: "relative" }}>
            <Box sx={{ display: "flex", alignItems: "center", position: "absolute", top: "-55px", right: "4px" }}>
                <TextField
                    label="Search"
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
                        filename={"blogs-data.csv"}
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
                    selected.length > 0 &&
                    <Tooltip title="Delete">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
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
                        rowCount={filteredRows.filter((n) => (n.status !== 0 && n.status !== 2)).length}
                        headCells={headCells}
                    />
                    <TableBody>
                        {stableSort(filteredRows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover={(row.status !== 0 && row.status !== 2) ? true : false}
                                        onClick={(event) => (row.status !== 0 && row.status !== 2) ? handleClick(event, row.id) : {}}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}
                                        sx={(row.status === 0 || row.status === 2) ? { backgroundColor: '#F4F4F5' } : { backgroundColor: '#fff' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                disabled={(row.status !== 0 && row.status !== 2) ? false : true}
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="center"
                                        >
                                            <CardMedia
                                                sx={{
                                                    borderColor: 'error.main',
                                                    border: 2, borderRadius: '10px',
                                                    height: 75, width: 120
                                                }}
                                                image={row.image}
                                                title="Product Image"
                                            />

                                        </TableCell>
                                        <TableCell align="center">
                                            {row.createdAt}
                                        </TableCell>

                                        <TableCell align="center">{row.user}</TableCell>
                                        <TableCell align="center">
                                            {
                                                row.status === 2
                                                    ? <Chip label="Đã xử lý" color="warning" />
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
                count={filteredRows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => {
                    return `${from} - ${to} của ${count}`;
                }}
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
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
