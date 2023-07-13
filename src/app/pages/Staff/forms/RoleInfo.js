import {
    Table, TableCell, TableContainer, TableHead,
    Box, Divider, Stack, Skeleton, TableRow, Paper,
} from "@mui/material";
import React from 'react';

import { Paragraph, H3 } from "../../../components/Typography";

const RoleInfo = ({ roles, permiss }) => {
    if (roles.length === 0 || permiss.length === 0) {
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
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                spacing={2}
                sx={{ paddingBottom: 3, paddingTop: 3 }}
            >
                <H3>{roles[0].name}</H3>
            </Stack>
            <Divider />
            <TableContainer
                component={Paper}
                sx={{ boxShadow: "none" }}
            >
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ paddingLeft: 4 }}>Mô tả quyền</TableCell>
                            <TableCell align="left">
                                <Paragraph
                                    sx={{ fontSize: "13px" }}
                                >{roles[0].describe}</Paragraph>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ paddingLeft: 4 }}>Mô tả truy cập</TableCell>
                            <TableCell
                                align="left"
                                sx={{ wordBreak: "normal !important", paddingRight: 2 }}
                            >
                                {permiss[0].describe}
                            </TableCell>
                        </TableRow>

                        {/* <TableRow>
                                        <TableCell sx={{ paddingLeft: 4 }}>Lần cuối đăng nhập</TableCell>
                                        <TableCell align="left">
                                            { data.lastLogin && convertToDateTimeStr(data, "lastLogin") }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ paddingLeft: 4 }}>Thời gian đăng ký</TableCell>
                                        <TableCell align="left">
                                            { data.createdAt && convertToDateTimeStr(data, "createdAt") }
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell sx={{ paddingLeft: 4 }}>Thời gian xóa</TableCell>
                                        <TableCell align="left">
                                            { data.createdAt && convertToDateTimeStr(data, "deletedAt") }
                                        </TableCell>
                                    </TableRow> */}
                    </TableHead>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RoleInfo;
