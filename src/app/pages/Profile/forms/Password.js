import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Box, Grid, Button, TextField, Divider, Avatar,
    ListItemButton, ListItemIcon, Card, CardMedia
} from "@mui/material";
import { useTheme, styled } from "@mui/system";
import { H5, H4, H3, Paragraph, Span } from "../../../components/Typography";

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 0',
    position: "relative"
}));

const Password = () => {
    const { palette } = useTheme();
    const rules = [
        {
            id: 1,
            text: "Tối thiểu 8 ký tự",
        },
        {
            id: 2,
            text: "Ít nhất một ký tự viết thường",
        },
        {
            id: 3,
            text: "Ít nhất một ký tự viết hoa",
        },
        {
            id: 4,
            text: "Ít nhất một số",
        }
    ]
    return (
        <CardRoot elevation={6}>
            <H5 sx={{ padding: "0 24px 20px" }}>Mật khẩu</H5>
            <Divider />
            <Box sx={{ margin: "24px" }}>
                <Grid container spacing={4} sx={{}}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{}}>
                        <TextField id="outlined-basic1" label="Mật khẩu cũ" variant="outlined" fullWidth
                            sx={{ marginBottom: "8px" }}
                        />
                        <TextField id="outlined-basic2" label="Mật khẩu mới" variant="outlined" fullWidth
                            sx={{ marginBottom: "8px" }}
                        />
                        <TextField id="outlined-basic2" label="Xác nhận mật khẩu" variant="outlined" fullWidth
                            sx={{ marginBottom: "8px" }}
                        />
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{}}>
                        <H5>Yêu cầu mật khẩu</H5>
                        <Paragraph sx={{ fontSize: "14px" }}>Đảm bảo rằng các yêu cầu này được đảm bảo:</Paragraph>
                        <Box sx={{ marginTop: "16px" }}>
                            {
                                rules.map((rule) => (
                                    <Box key={rule.id} sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        marginTop: "8px"
                                    }}>
                                        <Box sx={{
                                            width: "8px",
                                            height: "8px",
                                            borderRadius: "50%",
                                            backgroundColor: palette.primary.main
                                        }}></Box>
                                        <Paragraph sx={{ fontSize: "13px" }}>{rule.text}</Paragraph>
                                    </Box>
                                ))
                            }
                        </Box>
                    </Grid>
                </Grid>
            </Box>
            <Divider />
            <Button
                variant="contained"
                sx={{ margin: "20px 24px 0" }}
            >Lưu thay đổi</Button>
        </CardRoot>
    )
}

export default Password