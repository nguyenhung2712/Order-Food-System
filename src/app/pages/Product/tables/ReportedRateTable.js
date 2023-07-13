import { useState, useEffect } from "react";
import React from 'react';
import {
    Box, Grid, Select, MenuItem, styled, Typography, Avatar, Divider, TextField,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack, useTheme,
    Toolbar, Tooltip, CardMedia, Button, Dialog, DialogActions, Skeleton,
    DialogContent, Chip, DialogTitle, Backdrop, CircularProgress,
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { H2, H4, H3, Paragraph, Span } from "../../../components/Typography";

import 'react-toastify/dist/ReactToastify.css';

import { convertToDateTimeStr, getComparator, stableSort, sweetAlert, toastify } from "../../../utils/utils";
import { SortTableHead } from "../../../components";

import UserService from "../../../services/user.service";
import RateService from "../../../services/rate.service";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
/* import { addDocument } from '../../../services/firebase/service'; */
import useAuth from "../../../hooks/useAuth";

const headCells = [
    {
        id: 'userRate',
        numeric: false,
        disablePadding: true,
        label: 'Người đánh giá',
    },
    {
        id: 'createdAt',
        numeric: false,
        disablePadding: false,
        label: 'Báo cáo lúc',
    },
    {
        id: 'userReport',
        numeric: false,
        disablePadding: false,
        label: 'Người báo cáo',
    },
    {
        id: 'reason',
        numeric: false,
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

export default function ReportedRateTable({ render, isRender, onSetProgress, onSetLoading }) {
    const { user } = useAuth();
    const { palette } = useTheme();
    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;
    const [filterType, setFilterType] = useState("default");
    const [isOpenDetail, setOpenDetail] = useState(false);
    const [curInteract, setCurInteract] = useState();
    const [rows, setRows] = useState();
    const [filteredRows, setFilteredRows] = useState();
    const [filterText, setFilterText] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('header');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    }

    useEffect(() => {
        onSetLoading(true);
        (async () => {
            await RateService.getAllReports({
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
                    let reports = res.data.payload;
                    let rows = reports.map(report => ({
                        id: report.id,
                        createdAt: convertToDateTimeStr(report, "createdAt", true),
                        rating: report.rating,
                        reason: report.reason ? report.reason.reasonName : report.otherReason,
                        userReport: report.user,
                        userRating: report.rating.user,
                        status: report.status
                    }));
                    setFilteredRows(rows);
                    setRows(rows);
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
                row.rating.remarks.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                row.userReport.firstName.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                row.userReport.lastName.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                row.userRating.firstName.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                row.userRating.lastName.toLowerCase().indexOf(filterText.toLowerCase()) > -1 ||
                row.reason.toLowerCase().indexOf(filterText.toLowerCase()) > -1
            ))
        }
    }, [filterText]);

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
        sweetAlert({
            title: 'Đình chỉ tài khoản',
            text: "Xác nhận đình chỉ tài khoản vi phạm?",
            icon: 'info',
            cancelColor: errorColor,
            confirmColor: primaryColor
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await UserService.updateUser(id, { status: 2, disabledAt: newDate })
                        .then(async (res) => {
                            /* await addDocument("notifications", {
                                title: "Báo cáo vi phạm",
                                message: `Một trong các blog của bạn đã vi phạm điều lệ của chúng tôi. Chúng tôi đã tạm ẩn nó đi.`,
                                usePath: "/my-account/blogs",
                                staffPath: null,
                                readBy: [],
                                image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                                receivedId: [rows.filter(blog => blog.id === id)[0].userId],
                                status: 1
                            }); */
                            toastify({
                                message: "Đã đình chỉ người dùng",
                                position: "top-right",
                                type: "success"
                            });
                        });
                }
                setLoading(false);
                setFilterType("default");
            });
    }
    const handleSendWarning = async (id) => {
        sweetAlert({
            title: 'Gửi mail',
            text: "Xác nhận gửi mail cảnh báo cho tài khoản vi phạm?",
            icon: 'info',
            cancelColor: errorColor,
            confirmColor: primaryColor
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await UserService.sendWarningMail(id)
                        .then(async (res) => {
                            toastify({
                                message: "Đã gửi mail cảnh cáo người dùng",
                                position: "top-right",
                                type: "success"
                            });
                        });
                }
                setLoading(false);
                setFilterType("default");
            });
    }

    const handleSolveReport = async ({ rating }) => {
        /* let reporterIds = rows.filter(row => row.blogId === blogId).map(row => row.userId);
        reporterIds = [...new Set(reporterIds)]; */
        sweetAlert({
            title: 'Xử lý vi phạm',
            text: "Xác nhận xử lý đánh giá vi phạm?",
            icon: 'info',
            cancelColor: errorColor,
            confirmColor: primaryColor
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    await RateService.solveReport(rating.id, user.id)
                        .then(async (res) => {
                            /* await addDocument("notifications", {
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
                            }); */
                            setSelected([]);
                            setCurInteract(null);
                            setOpenDetail(false);
                            toastify({
                                message: "Đã xử lý đánh giá vi phạm",
                                position: "top-right",
                                type: "success"
                            });
                            render(curr => !curr);
                        });
                }
                setFilterType("default");
                setLoading(false);
            });
    }

    const handleDelete = (id) => {
        let selectedArr = selected;
        sweetAlert({
            title: 'Xóa báo cáo',
            text: "Xác nhận các báo cáo vi phạm?",
            icon: 'info',
            cancelColor: errorColor,
            confirmColor: primaryColor
        })
            .then(async (result) => {
                setLoading(true);
                if (result.isConfirmed) {
                    selectedArr.forEach(async (id) => {
                        await RateService.deleteReport(id)
                            .then(async (res) => {
                                toastify({
                                    message: "Đã xóa báo cáo vi phạm",
                                    position: "top-right",
                                    type: "success"
                                });
                                render(curr => !curr);
                            });
                    });
                }
                setSelected([]);
                setLoading(false);
            });
    }

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const handleFilterChange = (event) => {
        setFilterText(event.target.value);
    };

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
                        filename={"products-data.csv"}
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

                {selected.length > 0 && (
                    <Tooltip title="Xóa">
                        <IconButton onClick={handleDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
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
                        rowCount={filteredRows.filter((n) => n.status !== 0).length}
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
                                        <TableCell align="left" sx={{ px: 0, textTransform: 'capitalize' }}>
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={row.userRating.avatar} />
                                                <div style={{ marginLeft: "4px" }}>{row.userRating.firstName + ' ' + row.userRating.lastName}</div>
                                            </Box>
                                        </TableCell>
                                        {/* <TableCell
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

                                        </TableCell> */}
                                        <TableCell align="left">
                                            {row.createdAt}
                                        </TableCell>

                                        <TableCell align="center" sx={{ px: 0, textTransform: 'capitalize' }}>
                                            <Box display="flex" alignItems="center">
                                                <Avatar src={row.userReport.avatar} />
                                                <div style={{ marginLeft: "4px" }}>{row.userReport.firstName + ' ' + row.userReport.lastName}</div>
                                            </Box>
                                        </TableCell>

                                        <TableCell align="left">{row.reason}</TableCell>
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
                count={filteredRows.length}
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
                            maxWidth: "900px",
                            minWidth: "600px",
                        }
                    }}
                >
                    <DialogTitle id="alert-dialog-title">
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}>
                            <H2>Thông tin báo cáo</H2>
                            {
                                curInteract.status === 1
                                    ? <Chip label="Chưa xử lý" variant="outlined" size="medium"
                                        color="warning"
                                    />
                                    : <Chip label="Đã xử lý" variant="outlined" size="medium"
                                        color="success"
                                    />
                            }
                        </Box>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={0}>
                            <Grid item lg={6} md={6} sm={6} xs={12} sx={{
                                borderRight: windowWidth >= 600 ? "1px solid #ede5e5" : "none"
                            }}>
                                <H4 sx={{ fontSize: "16px", marginBottom: "14px" }}>Lí do: <Span sx={{ fontWeight: "400" }}>{curInteract.reason}</Span></H4>
                                <Box sx={{ marginBottom: "14px" }}>
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
                                            image={curInteract.userReport.avatar}
                                            title="Reporter Avt"
                                        />
                                        <Span sx={{ fontWeight: "400" }}>{curInteract.userReport.firstName + " " + curInteract.userReport.lastName}</Span>
                                    </Box>
                                </Box>
                                <Box>
                                    <H4 sx={{ fontSize: "16px" }}>Thời điểm: <Span sx={{ fontWeight: "400" }}>{curInteract.createdAt}</Span></H4>
                                </Box>
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12} sx={{
                                margin: windowWidth >= 600 ? "0" : "20px 0 24px"
                            }}>
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: windowWidth < 600 ? "flex-start" : "center",
                                    justifyContent: "center",
                                    height: "100%"
                                }}>
                                    <CardMedia
                                        sx={{
                                            height: 80,
                                            width: 80,
                                            objectFit: "fit",
                                            borderRadius: "50%"
                                        }}
                                        image={curInteract.userRating.avatar}
                                        title={curInteract.userRating.firstName + " " + curInteract.userRating.lastName}
                                    />
                                    <H3 sx={{
                                        margin: "8px 0"
                                    }}>{curInteract.userRating.firstName + " " + curInteract.userRating.lastName}</H3>

                                </Box>
                            </Grid>
                            {windowWidth < 600 ? <Divider sx={{ color: "#ede5e5", width: "100%" }} /> : ""}
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ marginTop: "12px" }}>
                                <H3 sx={{ marginBottom: "12px" }}>Thông tin đánh giá</H3>
                                <Box sx={{ display: 'flex' }}>
                                    {[...Array(5)].map((_, idx) => (
                                        <StarIcon
                                            key={idx}
                                            fontSize="small"
                                            sx={{
                                                color: idx < curInteract.rating.score ? "orange" : "gray"
                                            }}
                                        />
                                    ))}
                                </Box>
                                <Paragraph sx={{ marginBottom: "6px" }}>{curInteract.rating.remarks}</Paragraph>
                                {/* <img src={curInteract.rating.images} alt="Blog Image" style={{
                                    maxWidth: "100%"
                                }} /> */}
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{
                        display: "flex",
                        justifyContent: curInteract.status === 1 ? "space-between" : "flex-end",
                        padding: "12px"
                    }}>
                        {
                            curInteract.status === 1 &&
                            <Select size="small" value={filterType}
                                onChange={(e) => { setFilterType(e.target.value) }}
                                sx={{
                                    margin: "8px 0"
                                }}
                            >
                                <MenuItem value="default" disabled>Chọn hình thức</MenuItem>
                                <MenuItem value="send_mail"
                                    onClick={() => handleSendWarning(curInteract.userRating.id)}
                                >Gửi mail cảnh cáo</MenuItem>
                                <MenuItem value="ban"
                                    onClick={() => handleDisable(curInteract.userRating.id)}
                                >Đình chỉ người dùng</MenuItem>
                            </Select>
                        }
                        <Box>
                            {
                                curInteract.status === 1
                                    ? <>
                                        <Button onClick={() => {
                                            setSelected([]);
                                            setOpenDetail(false)
                                        }}
                                            color="warning" variant="contained"
                                            sx={{ marginRight: "12px" }}
                                        >Hủy</Button>
                                        <Button onClick={() => handleSolveReport(curInteract)} autoFocus variant="contained">
                                            Xử lý
                                        </Button>
                                    </>
                                    : <Button onClick={() => {
                                        setSelected([]);
                                        setOpenDetail(false)
                                    }}
                                        color="warning" variant="contained"
                                        sx={{ marginRight: "12px" }}
                                    >Thoát</Button>
                            }

                        </Box>
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
