import {
    Table, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Box, Divider, CardMedia, Stack, Skeleton
} from "@mui/material";
import React from 'react';

import { Paragraph, H3 } from "../../../components/Typography";

const UserInfo = ({ data }) => {

    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }
    const user = data.user;
    return (
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
                    image={user.avatar}
                    title="green iguana"
                />
                <H3>{user.firstName + " " + user.lastName}</H3>
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
                            <TableCell align="left" sx={{ wordBreak: "unset", paddingRight: 4 }}>
                                <Paragraph
                                    sx={{ fontSize: "13px" }}
                                >{user.email}</Paragraph>
                                <Chip
                                    label={user.isActive ? "Đã xác thực" : "Chưa xác thực"}
                                    color={user.isActive ? "info" : "warning"}
                                    size="small"
                                />
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ paddingLeft: 4 }}>Số điện thoại</TableCell>
                            <TableCell align="left">{user.phoneNum ? user.phoneNum : <i>Người dùng chưa cung cấp</i>}</TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UserInfo;
