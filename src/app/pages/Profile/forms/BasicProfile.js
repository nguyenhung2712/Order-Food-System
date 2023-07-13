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

const BasicProfile = () => {
    const { palette } = useTheme();
    return (
        <Grid container spacing={2} sx={{ height: "100%" }}>
            <Grid item lg={12} md={12} sm={12} xs={12} sx={{}}>
                <CardRoot elevation={6}>
                    <Box sx={{
                        "top": "0px",
                        "left": "0px",
                        "height": "125px",
                        "width": "100%",
                        "position": "absolute",
                        "backgroundColor": "rgb(198, 211, 237)"
                    }}>
                        <CardMedia
                            component="img"
                            height={"100%"}
                            width={"100%"}
                            image="/assets/images/study-3.jpg"
                            alt="Ảnh bìa"
                        />
                    </Box>
                    <Box sx={{
                        "zIndex": "1",
                        "marginTop": "55px",
                        "position": "relative"
                    }}
                    >
                        <Box sx={{
                            display: "flex",
                            justifyContent: "center"
                        }}>
                            <Box sx={{
                                position: "relative",
                            }}>
                                <Box sx={{
                                    width: "100px",
                                    height: "100px",
                                    margin: "auto",
                                    overflow: "hidden",
                                    borderRadius: "50%",
                                    border: "2px solid #fff"
                                }}>
                                    <Avatar
                                        alt="Nhân viên"
                                        src="/assets/images/avatars/001-man.svg"
                                        sx={{ width: "100%", height: "100%" }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                        <H4 sx={{ textAlign: "center", margin: "12px 0 24px" }}>..name..</H4>
                    </Box>
                </CardRoot>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12} sx={{}}>
                <CardRoot elevation={6}>
                    <H5 sx={{ padding: "0 24px 20px" }}>Thông tin cơ bản</H5>
                    <Divider />
                    <Box sx={{ margin: "24px" }}>
                        <Grid container spacing={2} sx={{}}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{}}>
                                <TextField id="outlined-basic1" label="Tên đầy đủ" variant="outlined" fullWidth />
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{}}>
                                <TextField id="outlined-basic2" label="Email" variant="outlined" fullWidth />

                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{}}>
                                <TextField id="outlined-basic3" label="Tên đăng nhập" variant="outlined" fullWidth />
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <Button
                        variant="contained"
                        sx={{ margin: "20px 24px 0" }}
                    >Lưu thay đổi</Button>
                </CardRoot>
            </Grid>
        </Grid>
    )
}

export default BasicProfile