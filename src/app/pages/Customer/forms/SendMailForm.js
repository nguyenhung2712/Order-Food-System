import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Box, Divider,
    Button, styled,
    InputLabel, MenuItem,
    FormControl, Select, Pagination,
    TableContainer, TableHead, TableRow, TableCell, Table, Paper
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

import { convertToDateTimeStr } from "../../../utils/utils";

const CustomButton = styled(Button)(({ theme }) => ({
    height: 60,
    whiteSpace: 'pre',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    fontSize: '16px',
    '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
    '& svg': {
        width: "50px",
        fontSize: '24px',
        paddingLeft: '16px',
        verticalAlign: 'middle',
    },
}));

const itemsPerPage = 10;

const SendMailForm = ({ histories }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState();
    const [page, setPage] = useState(1);
    return (
        <Box>
            <Divider />
            <Box
                sx={{
                    padding: "0 16px"
                }}
            >
                <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Mục đích</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        label="Mục đích"
                    /* value={age} */
                    /* onChange={handleChange} */
                    >
                        <MenuItem value={1}>Gửi mail xác thực</MenuItem>
                        <MenuItem value={2}>Gửi mail khôi phục tài khoản</MenuItem>
                        <MenuItem value={3}>Gửi hóa đơn mới nhất</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    variant="contained"
                    component="label"
                    color="info"
                    sx={{
                        my: 2,
                        fontSize: "0.9rem",
                        borderRadius: "6px !important",
                        border: 1
                    }}
                >
                    <EmailIcon sx={{ marginRight: "10px" }} />Gửi mail
                </Button>
                <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none" }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
                            {
                                histories &&
                                histories
                                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                    .map(history => (
                                        <TableRow key={history.id}>
                                            <TableCell sx={{ paddingLeft: 4 }}>
                                                {convertToDateTimeStr(history, "createdAt", true)}
                                            </TableCell>
                                            <TableCell align="left">
                                                {history.action}
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableHead>
                    </Table>
                </TableContainer>
                <Box
                    sx={{
                        margin: "16px 0",
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Pagination
                        count={Math.ceil(histories.length / itemsPerPage)}
                        page={page}
                        onChange={(event, val) => setPage(val)}
                        defaultPage={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default SendMailForm;
