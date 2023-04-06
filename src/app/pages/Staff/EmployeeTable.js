import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Chip,
    styled, Typography,
    Table, TableBody, TableCell, TablePagination, TableRow, Stack,
    Toolbar, Tooltip, CircularProgress
} from "@mui/material";
import { alpha } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import EastIcon from '@mui/icons-material/East';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { CSVLink } from 'react-csv';
import swal from 'sweetalert';

import { getComparator, stableSort } from "../../utils/utils";
import { SortTableHead } from "../../components";
import StaffService from "../../services/staff.service";
import { unable } from "../../redux/actions/StaffActions";

const headCells = [
    {
        id: 'username',
        numeric: false,
        disablePadding: true,
        label: 'Tên tài khoản',
    },
    {
        id: 'fullname',
        numeric: false,
        disablePadding: false,
        label: 'Họ tên',
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

const EmployeeTable = ({ rows, setRender }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('username');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);

    /* useEffect(() => {
        (async () => {
            await StaffService.getAllStaffs()
                .then((res) => {
                    let staffs = res.data.payload;
                    let rows = staffs.map(staff => ({
                        id: staff.id,
                        username: staff.username, 
                        fullname: staff.fullname, 
                        status: staff.status,
                        createdAt: new Date(staff.createdAt)
                    }));
                    setRows(rows);
                    dispatch(init(staffs));
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, [isRender]); */

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.filter((n) => [0, 3].includes(n.status)).map((n) => n.id);
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
        navigate("/staff/edit/" + id);
    }

    const handleViewDetail = (id) => {
        navigate("/staff/" + id);
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
                    setLoading(true);
                    selectedArr.forEach(async (id) => {
                        await StaffService.deleteStaff(id)
                            .then(res => {
                                setLoading(false);
                                swal({
                                    title: "Thành công",
                                    text: "Xóa tạm thời tài khoản nhân viên thành công",
                                    icon: "success"
                                });
                                dispatch(unable(id));
                                setRender(curr => !curr);
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
                        ?    <Tooltip title="Delete">
                                <IconButton onClick={ handleDelete }>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        :   <CircularProgress />
                    
                ) : (
                    <Button 
                        variant="contained" 
                        component="label"
                        color="primary"
                        sx={{ 
                            my: 2 ,
                            fontSize: "1rem",
                            borderRadius: "6px !important",

                            border: 1
                        }}
                    >
                        <CSVLink 
                            data={rows} 
                            filename={"staffs-data.csv"}
                            target="_blank" 
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <FileDownloadIcon sx={{ marginRight: 1 }} />
                            Xuất dữ liệu
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
                        rowCount={rows.filter((n) => [0, 3].includes(n.status)).length}
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
                                        hover={ [0, 3].includes(row.status) ? true : false }
                                        onClick={(event) => ![0, 3].includes(row.status) ? handleClick(event, row.id) : {} }
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={index}
                                        selected={isItemSelected}

                                        sx={ [0, 3].includes(row.status) ? { backgroundColor: '#F4F4F5' } : { backgroundColor: '#fff' } }
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                                disabled={ ![0, 3].includes(row.status) ? false : true }
                                            />
                                        </TableCell>
                                        <TableCell
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                            align="left"
                                        >
                                            { row.username }
                                        </TableCell>
                                        <TableCell align="left">{row.fullname}</TableCell>
                                        <TableCell align="center">
                                            {
                                                row.status === 2 
                                                    ? <Chip label="Tạm ẩn" color="warning" />
                                                    : row.status === 1
                                                        ? <Chip label="Có sẵn" color="primary" />
                                                        : row.status === 3
                                                            ? <Chip label="Vô hiệu hóa" color="error" />
                                                            : <Chip label="Tạm xóa" />
                                            }
                                        </TableCell>
                                        
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Button aria-label="edit" onClick={() => handleOpenEdit(row.id)}>
                                                    <EditIcon />
                                                </Button>
                                                <Button aria-label="east" onClick={() => handleViewDetail(row.id)}>
                                                    <EastIcon />
                                                </Button>
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
            />
        </Box>
    );
}

export default EmployeeTable;