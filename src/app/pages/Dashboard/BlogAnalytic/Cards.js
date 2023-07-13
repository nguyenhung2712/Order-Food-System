import { Card, Grid, lighten, Skeleton, useTheme, Box, Button } from '@mui/material';
import React from 'react';

import { H2, Span, Paragraph } from "../../../components/Typography";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { numberFormatter } from '../../../utils/utils';

const Cards = ({ data }) => {
    const { palette } = useTheme();
    const textError = palette.error.main;
    const bgError = lighten(palette.error.main, 0.85);

    if (!data) {
        return (
            <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
                {
                    [1, 2, 3, 4].map((_, idx) => (
                        <Grid item lg={3} md={3} sm={6} xs={12} key={idx}>

                            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                                <Skeleton
                                    variant="rounded" width={"100%"}
                                    height={"120px"}
                                />
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item lg={3} md={3} sm={6} xs={12}>
                <Card elevation={3} sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Box sx={{
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        <Paragraph sx={{
                            fontSize: "0.6875rem",
                            color: "rgba(52, 49, 76, 0.54)"
                        }}>
                            Tổng lượt thích
                        </Paragraph>
                        <H2 sx={{
                            fontSize: "28px"
                        }}>{data.likesTotal}</H2>
                    </Box>
                    <Button sx={{
                        borderRadius: "2.5rem",
                        backgroundColor: (data.monthLikes - (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) < 0 ? bgError : "rgba(9,182,109,.17)",
                        color: (data.monthLikes - (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) < 0 ? textError : "#08ad6c",
                        width: "fit-content",
                        padding: "0.3125rem 1.125rem",
                        fontSize: "0.75rem",
                        '&:hover': {
                            backgroundColor: (data.monthLikes - (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) < 0 ? textError : palette.success.main,
                            color: palette.common.white
                        }
                    }}>
                        {
                            (data.monthLikes - (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) > 0
                                ? <ArrowDropUpIcon />
                                : <ArrowDropDownIcon />
                        }
                        <Span>
                            {((data.monthLikes - (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) * 100 / (data.lastMonthLikes === 0 ? 1 : data.lastMonthLikes)) + " %"}
                        </Span>
                    </Button>
                </Card>
            </Grid>

            <Grid item lg={3} md={3} sm={6} xs={12}>
                <Card elevation={3} sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Box sx={{
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        <Paragraph sx={{
                            fontSize: "0.6875rem",
                            color: "rgba(52, 49, 76, 0.54)"
                        }}>
                            Trung bình lượt thích
                        </Paragraph>
                        <H2 sx={{
                            fontSize: "28px"
                        }}>
                            {
                                data.avgLikesTotal < 1
                                    ? data.avgLikesTotal.toFixed(2)
                                    : numberFormatter(data.avgLikesTotal, 2)
                            }
                        </H2>
                    </Box>
                    <Button sx={{
                        borderRadius: "2.5rem",
                        backgroundColor: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) < 0 ? bgError : "rgba(9,182,109,.17)",
                        color: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) < 0 ? textError : "#08ad6c",
                        width: "fit-content",
                        padding: "0.3125rem 1.125rem",
                        fontSize: "0.75rem",
                        '&:hover': {
                            backgroundColor: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) < 0 ? textError : palette.success.main,
                            color: palette.common.white
                        }
                    }}>
                        {
                            (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) > 0
                                ? <ArrowDropUpIcon />
                                : <ArrowDropDownIcon />
                        }
                        <Span>
                            {
                                (
                                    (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) * 100
                                    / (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) < 1
                                    ? (
                                        (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) * 100
                                        / (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)
                                    ).toFixed(2)
                                    : numberFormatter((
                                        (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)) * 100
                                        / (data.avgLastMonthLikes === 0 ? data.avgMonthLikes : data.avgLastMonthLikes)
                                    ), 2)
                                    + " %"
                            }
                        </Span>
                    </Button>
                </Card>
            </Grid>

            <Grid item lg={3} md={3} sm={6} xs={12}>
                <Card elevation={3} sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Box sx={{
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        <Paragraph sx={{
                            fontSize: "0.6875rem",
                            color: "rgba(52, 49, 76, 0.54)"
                        }}>
                            Tổng lượt báo cáo
                        </Paragraph>
                        <H2 sx={{
                            fontSize: "28px"
                        }}>{data.reportsTotal}</H2>
                    </Box>
                    <Button sx={{
                        borderRadius: "2.5rem",
                        backgroundColor: (data.monthReports - (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) < 0 ? bgError : "rgba(9,182,109,.17)",
                        color: (data.monthReports - (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) < 0 ? textError : "#08ad6c",
                        width: "fit-content",
                        padding: "0.3125rem 1.125rem",
                        fontSize: "0.75rem",
                        '&:hover': {
                            backgroundColor: (data.monthReports - (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) < 0 ? textError : palette.success.main,
                            color: palette.common.white
                        }
                    }}>
                        {
                            (data.monthReports - (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) > 0
                                ? <ArrowDropUpIcon />
                                : <ArrowDropDownIcon />
                        }
                        <Span>
                            {((data.monthReports - (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) * 100 / (data.lastMonthReports === 0 ? 1 : data.lastMonthReports)) + " %"}
                        </Span>
                    </Button>
                </Card>
            </Grid>

            <Grid item lg={3} md={3} sm={6} xs={12}>
                <Card elevation={3} sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Box sx={{
                        marginBottom: "20px",
                        textAlign: "center"
                    }}>
                        <Paragraph sx={{
                            fontSize: "0.6875rem",
                            color: "rgba(52, 49, 76, 0.54)"
                        }}>
                            Trung bình lượt báo cáo
                        </Paragraph>
                        <H2 sx={{
                            fontSize: "28px"
                        }}>
                            {
                                data.avgReportsTotal < 1
                                    ? data.avgReportsTotal.toFixed(2)
                                    : numberFormatter(data.avgReportsTotal, 2)
                            }
                        </H2>
                    </Box>
                    <Button sx={{
                        borderRadius: "2.5rem",
                        backgroundColor: (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) < 0 ? bgError : "rgba(9,182,109,.17)",
                        color: (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) < 0 ? textError : "#08ad6c",
                        width: "fit-content",
                        padding: "0.3125rem 1.125rem",
                        fontSize: "0.75rem",
                        '&:hover': {
                            backgroundColor: (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) < 0 ? textError : palette.success.main,
                            color: palette.common.white
                        }
                    }}>
                        {
                            (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) > 0
                                ? <ArrowDropUpIcon />
                                : <ArrowDropDownIcon />
                        }
                        <Span>
                            {
                                (
                                    (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) * 100
                                    / (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) < 1
                                    ? (
                                        (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) * 100
                                        / (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)
                                    ).toFixed(2)
                                    : numberFormatter((
                                        (data.avgMonthReports - (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)) * 100
                                        / (data.avgLastMonthReports === 0 ? 0.01 : data.avgLastMonthReports)
                                    ), 2)
                                    + " %"
                            }
                        </Span>
                    </Button>
                </Card>
            </Grid>

        </Grid>
    );
};

export default Cards;
