import { useState, useEffect } from "react";
import React from 'react';
import {
    Box, Grid, Select, MenuItem,
    styled, Typography, Skeleton,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack,
    Toolbar, Tooltip, CardMedia, Button, Dialog, DialogActions,
    DialogContent, Chip, DialogTitle, Backdrop, CircularProgress,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { H2, H4, H3, Paragraph, Span } from "../../../components/Typography";

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { convertToDateTimeStr, getComparator, stableSort } from "../../../utils/utils";
import { SortTableHead } from "../../../components";
import BlogService from "../../../services/blog.service";
import UserService from "../../../services/user.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import { addDocument } from '../../../services/firebase/service';
import useAuth from "../../../hooks/useAuth";

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
        label: 'Báo cáo lúc',
    },
    {
        id: 'user',
        numeric: true,
        disablePadding: false,
        label: 'Người báo cáo',
    },
    {
        id: 'reason',
        numeric: true,
        disablePadding: false,
        label: 'Lý do',
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

export default function ReportTable({ render, isRender, onSetProgress, onSetLoading }) {
    const placeholderImage = `/assets/images/viet-blog-3.jpg`;
    const { user } = useAuth();

    const [filterType, setFilterType] = useState("default");
    const [isOpenDetail, setOpenDetail] = useState(false);
    const [curInteract, setCurInteract] = useState();

    const [filteredRows, setFilteredRows] = useState();
    const [filterText, setFilterText] = useState('');
    const [rows, setRows] = useState();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('header');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        onSetLoading(false);
        (async () => {
            await BlogService.getAllReports({
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
                    //Chỉnh sửa lại cho gọn
                    let reports = res.data.payload;
                    let rows = reports.map(report => ({
                        id: report.id,
                        username: report.user.firstName + " " + report.user.lastName,
                        userId: report.user.id,
                        user: report.user,
                        reportedUsername: report.blog.user.firstName + " " + report.blog.user.lastName,
                        reportedUId: report.blog.user.id,
                        reportedUser: report.blog.user,
                        reason: report.reason ? report.reason.reasonName : report.otherReason,
                        reasonDesc: report.reason ? report.reason.reasonDes : "",
                        blog: getImageUrl(report.blog.content) ? getImageUrl(report.blog.content) : placeholderImage,
                        blogHeader: report.blog.header,
                        blogId: report.blog.id,
                        createdAt: convertToDateTimeStr(report, "createdAt", true)
                    }));
                    setRows(rows);
                    setFilteredRows(rows);
                })
                .catch((err) => {
                    console.log(err);
                });
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

    const handleDisable = async (id) => {
        let newDate = new Date().toLocaleString();
        Swal.fire({
            title: 'Đình chỉ tài khoản',
            text: "Xác nhận đình chỉ tài khoản vi phạm?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await UserService.updateUser(id, { status: 2, disabledAt: newDate })
                        .then(async (res) => {
                            await addDocument("notifications", {
                                title: "Báo cáo vi phạm",
                                message: `Một trong các blog của bạn đã vi phạm điều lệ của chúng tôi. Chúng tôi đã tạm ẩn nó đi.`,
                                usePath: "/my-account/blogs",
                                staffPath: null,
                                readBy: [],
                                image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                                receivedId: [rows.filter(blog => blog.id === id)[0].userId],
                                status: 1
                            });
                            toast.success('Đã đình chỉ người dùng.', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "light",
                            });
                        });
                }
                setFilterType("default");
                setLoading(false);
            });
    }
    const handleSendWarning = async (id) => {
        Swal.fire({
            title: 'Gửi mail',
            text: "Xác nhận gửi mail cảnh báo cho tài khoản vi phạm?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await UserService.sendWarningMail(id)
                        .then(async (res) => {
                            toast.success('Đã gửi mail cảnh cáo người dùng.', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "light",
                            });
                        });
                }
                setFilterType("default");
                setLoading(false);
            });
    }
    const handleSolveReport = async ({ blogId, reportedUId, userId }) => {
        let reporterIds = rows.filter(row => row.blogId === blogId).map(row => row.userId);
        reporterIds = [...new Set(reporterIds)];

        Swal.fire({
            title: 'Xử lý vi phạm',
            text: "Xác nhận xử lý blog vi phạm?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await BlogService.solveReport(blogId, user.id)
                        .then(async (res) => {
                            await addDocument("notifications", {
                                title: "Báo cáo vi phạm",
                                message: `Một trong các blog của bạn đã vi phạm điều lệ của chúng tôi. Chúng tôi đã tạm ẩn nó đi.`,
                                usePath: "/my-account/blogs",
                                staffPath: null,
                                readBy: [],
                                image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                                receivedId: [reportedUId],
                                status: 1
                            });
                            await addDocument("notifications", {
                                title: "Cập nhật báo cáo",
                                message: `Chúng tôi đã xem xét và xử lý blog được bạn báo cáo`,
                                usePath: "/my-account/blogs",
                                staffPath: null,
                                readBy: [],
                                image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                                receivedId: [...reporterIds],
                                status: 1
                            });
                            setSelected([]);
                            setCurInteract(null);
                            setOpenDetail(false);
                            toast.success('Đã xử lý blog vi phạm.', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "light",
                            });
                            render(curr => !curr);
                        });
                }
                setFilterType("default");
                setLoading(false);
            });
    }
    const handleDelete = () => {
        let selectedArr = selected;
        Swal.fire({
            title: 'Xóa báo cáo',
            text: "Xác nhận các báo cáo vi phạm đã chọn ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    selectedArr.forEach(async (id) => {
                        await BlogService.deleteReport(id)
                            .then(async (res) => {
                                render(curr => !curr);
                            });
                    });
                }
                setSelected([]);
                setLoading(false);
            });
        /* let selectedArr = selected;
        swal({
            title: "Xóa nội dung",
            text: "Đồng ý xóa các nội dung đã chọn ?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
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
                                setIsRender(curr => !curr);
                            });
                    });
                    setSelected([]);
                }
            }); */
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

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
                            data={rows}
                            filename={"blogs-data.csv"}
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
                                                image={row.blog}
                                                title="Blog Image"
                                            />

                                        </TableCell>
                                        <TableCell align="center">
                                            {row.createdAt}
                                        </TableCell>

                                        <TableCell align="center">{row.username}</TableCell>
                                        <TableCell align="center">{row.reason}</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <StyledIconBtn aria-label="edit" onClick={() => {
                                                    setCurInteract(row);
                                                    setOpenDetail(true);
                                                }}>
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
                    },

                }}
            />
            {
                curInteract &&
                <Dialog
                    open={isOpenDetail}
                    onClose={() => {
                        setOpenDetail(false);
                        setSelected([]);
                        setFilterType("default");
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    sx={{
                        '& .MuiDialog-paper': {
                            maxWidth: "900px"
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <H2>Thông tin báo cáo</H2>
                            <Chip label="Chưa xử lý" variant="outlined" size="medium"
                                color="warning"
                            />
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={0}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <H3 sx={{ textAlign: "center", marginBottom: "6px" }}>{curInteract.blogHeader}</H3>
                                <img src={curInteract.blog} alt="Blog Image" style={{
                                    maxWidth: "100%"
                                }} />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%"
                                }}>
                                    <CardMedia
                                        sx={{
                                            height: 150,
                                            width: 150,
                                            objectFit: "fit",
                                            borderRadius: "50%"
                                        }}
                                        image={curInteract.reportedUser.avatar}
                                        title="green iguana"
                                    />
                                    <H3 sx={{
                                        margin: "8px 0"
                                    }}>{curInteract.reportedUsername}</H3>
                                    <Select size="small" value={filterType}
                                        onChange={(e) => { setFilterType(e.target.value) }}
                                        sx={{
                                            margin: "8px 0"
                                        }}
                                    >
                                        <MenuItem value="default" disabled>Chọn hình thức</MenuItem>
                                        <MenuItem value="send_mail"
                                            onClick={() => handleSendWarning(curInteract.reportedUId)}
                                        >Gửi mail cảnh cáo</MenuItem>
                                        <MenuItem value="ban"
                                            onClick={() => handleDisable(curInteract.reportedUId)}
                                        >Đình chỉ người dùng</MenuItem>
                                    </Select>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ marginTop: "24px" }}>
                            <Grid item lg={6} md={6} sm={6} xs={12} >
                                <H4 sx={{ fontSize: "16px", marginBottom: "8px" }}>Lí do: <Span sx={{ fontWeight: "400" }}>{curInteract.reason}</Span></H4>
                                <Box sx={{ marginBottom: "8px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <H4 sx={{ fontSize: "16px", marginRight: "10px" }}>Người báo cáo: </H4>
                                        <CardMedia
                                            sx={{
                                                height: 30,
                                                width: 30,
                                                objectFit: "fit",
                                                borderRadius: "50%",
                                                marginRight: "4px"
                                            }}
                                            image={curInteract.user.avatar}
                                            title="Reporter Avt"
                                        />
                                        <Span sx={{ fontWeight: "400" }}>{curInteract.username}</Span>
                                    </Box>
                                </Box>
                                <Box>
                                    <H4 sx={{ fontSize: "16px" }}>Thời gian báo cáo: <Span sx={{ fontWeight: "400" }}>{curInteract.createdAt}</Span></H4>
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <Paragraph>{curInteract.reasonDesc}</Paragraph>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDetail(false)} color="warning">Hủy</Button>
                        <Button onClick={() => handleSolveReport(curInteract)} autoFocus>
                            Xử lý
                        </Button>
                    </DialogActions>
                </Dialog>
            }
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
