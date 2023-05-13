import {
    Table, TableCell, TableContainer, TableHead, TableRow, Paper, Chip,
    Box, Divider,
    Button, CardMedia, Stack
} from "@mui/material";
import React from 'react';

import { H2, Paragraph, H3, H1 } from "../../../components/Typography";
import { convertToDateTimeStr } from "../../../utils/utils";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';

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
                    <CardMedia
                        sx={{
                            height: 70,
                            width: 70,
                            objectFit: "fit",
                            borderRadius: "50%"
                        }}
                        image={data.avatar}
                        title="green iguana"
                    />
                    <H3>{data.firstName + " " + data.lastName}</H3>
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
                                <TableCell sx={{ paddingLeft: 4 }}>Email</TableCell>
                                <TableCell align="left">
                                    <Paragraph
                                        sx={{ fontSize: "13px" }}
                                    >{data.email}</Paragraph>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ paddingLeft: 4 }}>Tên tài khoản</TableCell>
                                <TableCell align="left">
                                    <Paragraph
                                        sx={{ fontSize: "13px" }}
                                    >{data.username ? data.username : <i>Chưa đăng cung cấp</i>}</Paragraph>
                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell sx={{ paddingLeft: 4 }}>Lần cuối đăng nhập</TableCell>
                                <TableCell align="left">
                                    {
                                        data.lastLogin &&
                                            Date.parse(data.lastLogin) !== 0
                                            ? convertToDateTimeStr(data, "lastLogin", true)
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
                                ([0].includes(data.status) && data.disabledAt) &&
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Thời gian xóa</TableCell>
                                    <TableCell align="left">
                                        {convertToDateTimeStr(data, "deletedAt", true)}
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                [3].includes(data.status) && data.disabledAt &&
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Thời gian vô hiệu hóa</TableCell>
                                    <TableCell align="left">
                                        {convertToDateTimeStr(data, "disabledAt", true)}
                                    </TableCell>
                                </TableRow>
                            }
                            {
                                data.UserAddresses && data.UserAddresses.length > 0 && data.UserAddresses[0].userId && data.UserAddresses.map((address, index) => (
                                    <TableRow>
                                        <TableCell sx={{ paddingLeft: 4 }}>Địa chỉ {index + 1}</TableCell>
                                        <TableCell align="left">
                                            {
                                                address.title + ", " + address.address.address
                                                + " - " + address.address.province.provinceName
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableHead>
                    </Table>
                    <Box
                        sx={{
                            "padding": "16px",
                            "display": "flex",
                            "WebkitBoxAlign": "center",
                            "alignItems": "center",
                            "WebkitBoxPack": "justify",
                            "justifyContent": "space-between"
                        }}
                    >
                        <Button>
                            <LockOpenIcon /> Khôi phục mật khẩu
                        </Button>
                    </Box>
                </TableContainer>
            </Box>
        </div>
    );
};

export default UserInfo;
