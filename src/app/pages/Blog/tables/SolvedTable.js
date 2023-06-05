import { useState, useEffect } from "react";
import React from 'react';
import {
    Box,
    styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow,
    Toolbar, Stack, CardMedia, Button,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import 'react-toastify/dist/ReactToastify.css';

import { convertToDateTimeStr, getComparator, stableSort } from "../../../utils/utils";
import { SortTableHead } from "../../../components";
import BlogService from "../../../services/blog.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';

const headCells = [
    {
        id: 'blog',
        numeric: false,
        disablePadding: true,
        label: 'Blog',
    },
    {
        id: 'createdAt',
        numeric: true,
        disablePadding: false,
        label: 'Xử lý lúc',
    },
    {
        id: 'user',
        numeric: true,
        disablePadding: false,
        label: 'Người xử lý',
    },
    {
        id: 'actions',
        numeric: true,
        disablePadding: false,
        label: 'Chi tiết',
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

export default function SolvedTable({ isRender }) {
    const placeholderImage = `/assets/images/viet-blog-3.jpg`;

    const [rows, setRows] = useState([]);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('header');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        (async () => {
            await BlogService.getSolvedBlogs()
                .then(res => {
                    let blogs = res.data.payload;
                    let rows = blogs.map(blog => {
                        let { Archives, ...remains } = blog;
                        let archive = Archives.filter(archive => archive.admin)[0];
                        return {
                            blog: remains,
                            archive: archive,
                            blogImg: getImageUrl(remains.content) ? getImageUrl(remains.content) : placeholderImage,
                            createdAt: convertToDateTimeStr(archive, "createdAt"),
                            username: archive.admin.fullname
                        }
                    });
                    setRows(rows);
                })
        })()
    }, [isRender]);

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>

            <Toolbar
                sx={{
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 }
                }}
            >
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Danh sách
                </Typography>

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
                        data={rows}
                        filename={"blogs-data.csv"}
                        target="_blank"
                        style={{ display: 'flex', alignItems: 'center', textDecoration: "none", color: "#fff" }}
                    >
                        <FileDownloadIcon />
                    </CSVLink>
                </Button>
            </Toolbar>
            <TableContainer>
                <Table
                    sx={{ minWidth: 500 }}
                    aria-labelledby="tableTitle"
                    size={/* dense ? 'small' :  */'medium'}
                >
                    <SortTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        headCells={headCells}
                    />
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover={row.status !== 0 ? true : false}
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={index}
                                        sx={row.status === 0 ? { backgroundColor: '#F4F4F5' } : { backgroundColor: '#fff' }}
                                    >
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
                                                image={row.blogImg}
                                                title="Blog Image"
                                            />

                                        </TableCell>
                                        <TableCell align="center">
                                            {row.createdAt}
                                        </TableCell>

                                        <TableCell align="center">{row.username}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <StyledIconBtn aria-label="edit" >
                                                    <VisibilityIcon />
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
                    }
                }}
            />
        </Box>
    );
}
