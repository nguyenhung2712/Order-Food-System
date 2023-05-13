import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Typography, Avatar,
    Box, Divider,
    Tabs, Tab,
    Card, CardMedia, Stack
} from "@mui/material";
import React from 'react';

import { H2, Paragraph, H3, H1 } from "../../../components/Typography";
import { convertToDateTimeStr } from "../../../utils/utils";

const UserInfo = ({ data }) => {
    return (
        <div>
            <Box>
                <Divider />
                <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{ paddingBottom: 3, paddingTop: 3 }}
                >

                    <H3>{data.fullname}</H3>
                    <Chip
                        label={data.isActived ? "Đã xác nhận" : "Chưa xác nhận"}
                        color={data.isActived ? "info" : "warning"}
                        size="small"
                    />
                    {
                        [0, 3].includes(data.status) &&
                        <Chip
                            label={data.status === 0 ? "Đã xóa" : "Đã vô hiệu hóa"}
                            color="default"
                            size="small"
                        />
                    }
                </Stack>
                <Divider />
                <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none" }}
                >
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ paddingLeft: 4 }}>Tên tài khoản</TableCell>
                                <TableCell align="left">
                                    <Paragraph
                                        sx={{ fontSize: "13px" }}
                                    >{data.username}</Paragraph>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell sx={{ paddingLeft: 4 }}>Lần cuối đăng nhập</TableCell>
                                <TableCell align="left">
                                    {
                                        data.lastLogin &&
                                            Date.parse(data.lastLogin) !== 0
                                            ? convertToDateTimeStr(data, "lastLogin")
                                            : <i>Chưa đăng nhập lần nào</i>
                                    }
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ paddingLeft: 4 }}>Thời gian đăng ký</TableCell>
                                <TableCell align="left">
                                    {data.createdAt && convertToDateTimeStr(data, "createdAt", true)}
                                </TableCell>
                            </TableRow>
                            {
                                [0].includes(data.status) &&
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Thời gian xóa</TableCell>
                                    <TableCell align="left">
                                        {data.deletedAt && convertToDateTimeStr(data, "deletedAt", true)}
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                [3].includes(data.status) &&
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Thời gian vô hiệu hóa</TableCell>
                                    <TableCell align="left">
                                        {data.disabledAt && convertToDateTimeStr(data, "disabledAt", true)}
                                    </TableCell>
                                </TableRow>
                            }
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
};

export default UserInfo;
