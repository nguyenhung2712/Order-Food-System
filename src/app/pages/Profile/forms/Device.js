import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Box, Grid, TextField, Card, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
} from "@mui/material";
import { useTheme, styled } from "@mui/system";
import { H5, H4, H3, Paragraph, Span } from "../../../components/Typography";

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 0 0',
    position: "relative"
}));

const Device = () => {
    const { palette } = useTheme();
    const test = [
        {
            browser: "Chrome on Windows",
            device: "Dell XPS 12",
            location: "New York, USA",
            activityDate: "Now"
        },
        {
            browser: "Chrome on Windows",
            device: "Dell XPS 12",
            location: "New York, USA",
            activityDate: "Now"
        },
        {
            browser: "Chrome on Windows",
            device: "Dell XPS 12",
            location: "New York, USA",
            activityDate: "Now"
        },
    ];
    return (
        <CardRoot elevation={6}>
            <H5 sx={{ padding: "0 24px 20px" }}>Trình duyệt đăng nhập</H5>
            <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead sx={{ backgroundColor: '#FAFAFA' }}>
                        <TableRow>
                            <TableCell align="left" sx={{ padding: "24px 8px 24px 24px" }}>Trình duyệt</TableCell>
                            <TableCell align="left">Thiết bị</TableCell>
                            <TableCell align="left">Vị trí</TableCell>
                            <TableCell align="left">Ngày hoạt động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {test.map((row, index) => (
                            <TableRow
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left" sx={{
                                    padding: "24px 8px 24px 24px"
                                }}> {row.browser} </TableCell>
                                <TableCell align="left">{row.device}</TableCell>
                                <TableCell align="left">{row.location}</TableCell>
                                <TableCell align="left">{row.activityDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </CardRoot>
    )
}

export default Device