import { useState } from "react";
import React from 'react';
import {
    Box, Divider,
    Button, styled,
    InputLabel, MenuItem, Skeleton,
    FormControl, Select, Pagination,
    TableContainer, TableHead, TableRow, TableCell, Table, Paper
} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

import { convertToDateTimeStr } from "../../../utils/utils";
import UserService from "../../../services/user.service";

const itemsPerPage = 10;

const SendMailForm = ({ user, histories }) => {
    const [page, setPage] = useState(1);
    const [value, setValue] = useState(1);

    const handleSendMail = async (event) => {
        if (value === 1) {
            await UserService.sendRestoreMail(user.id)
                .then(res => {
                    //Thông báo người dùng
                    //Toastify
                })
        }
        if (value === 2) {
            await UserService.sendNewestOrder(user.id)
                .then(res => {
                    //Thông báo người dùng
                    //Toastify
                })
        }
    }

    if (!user || !histories) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }

    return (
        <Box>
            <Divider />
            <Box sx={{ padding: "0 16px" }} >
                <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">Mục đích</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        label="Mục đích"
                        onChange={(event) => setValue(event.target.value)}
                    >
                        <MenuItem value={1}>Gửi mail khôi phục tài khoản</MenuItem>
                        <MenuItem value={2}>Gửi hóa đơn mới nhất</MenuItem>
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
                    onClick={handleSendMail}
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
