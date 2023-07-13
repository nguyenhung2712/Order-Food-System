import React from 'react';

import { Grid, Card, CardMedia, CardContent, Skeleton, useTheme } from "@mui/material";
import { Box } from "@mui/system";

import { H3, Span, Paragraph } from "../../../components/Typography";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import { getTimeDifference, numberFormatter } from "../../../utils/utils";

const MostBlogs = ({ data }) => {
    const theme = useTheme();

    if (!data) {
        return (
            <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: "fit-content" }} component="div">
                    <H3 sx={{ margin: 0, fontSize: "1.25rem" }}>
                        <Span sx={{ color: theme.palette.primary.main }}>Blog</Span> mới nhất
                    </H3>
                </Grid>
                {
                    [1, 2, 3, 4].map((_, idx) => (
                        <Grid item lg={3} md={3} sm={6} xs={12} key={idx}>

                            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                                <Skeleton
                                    variant="rounded" width={"100%"}
                                    height={"320px"}
                                />
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    return (
        <Grid container spacing={2} sx={{ mb: 6 }}>
            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ height: "fit-content" }} component="div">
                <H3 sx={{ margin: 0, fontSize: "1.25rem" }}>
                    <Span sx={{ color: theme.palette.primary.main }}>Blog</Span> mới nhất
                </H3>
            </Grid>
            {
                data.map(blog => (
                    <Grid item lg={3} md={3} sm={6} xs={12} sx={{ height: "fit-content" }} component="div" key={blog.id}>
                        <Card>
                            <CardMedia
                                component="img"
                                alt="blog image"
                                image={`${blog.image}`}
                                height="300px"
                            />
                            <CardContent sx={{ padding: "0 !important" }}>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px" }}>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <ThumbUpIcon fontSize="small" sx={{
                                            color: "rgba(52, 49, 76, 0.54)",
                                            margin: "0 4px"
                                        }} />
                                        <Span sx={{ fontSize: "16px", marginRight: "8px" }}>{numberFormatter(blog.likesTotal, 0)}</Span>
                                        <CommentIcon fontSize="small" sx={{
                                            color: "rgba(52, 49, 76, 0.54)",
                                            margin: "0 4px"
                                        }} />
                                        <Span>{numberFormatter(blog.commentsTotal, 1)}</Span>
                                    </Box>
                                    <Paragraph sx={{
                                        "fontSize": "0.9375rem",
                                        "color": "rgba(52, 49, 76, 0.54)"
                                    }}>{getTimeDifference(new Date(blog.createdAt))}</Paragraph>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            }
        </Grid>
    );
};

export default MostBlogs;
