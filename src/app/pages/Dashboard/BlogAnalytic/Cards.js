import { Card, Fab, Grid, Icon, lighten, styled, useTheme, Box, Button } from '@mui/material';
import React from 'react';

import { H2, Span, Paragraph } from "../../../components/Typography";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { numberFormatter } from '../../../utils/utils';

const ContentBox = styled('div')(() => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
}));

const FabIcon = styled(Fab)(() => ({
    width: '44px !important',
    height: '44px !important',
    boxShadow: 'none !important',
}));

const H3 = styled('h3')(({ textcolor }) => ({
    margin: 0,
    color: textcolor,
    fontWeight: '500',
    marginLeft: '12px',
}));

const H1 = styled('h1')(({ theme }) => ({
    margin: 0,
    flexGrow: 1,
    color: theme.palette.text.secondary,
}));

/* const Span = styled('span')(({ textcolor }) => ({
    fontSize: '13px',
    color: textcolor,
    marginLeft: '4px',
})); */

const IconBox = styled('div')(() => ({
    width: 16,
    height: 16,
    color: '#fff',
    display: 'flex',
    overflow: 'hidden',
    borderRadius: '300px ',
    justifyContent: 'center',
    '& .icon': { fontSize: '14px' },
}));

const Cards = ({ data }) => {
    const { palette } = useTheme();
    const textError = palette.error.main;
    const bgError = lighten(palette.error.main, 0.85);

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
                        backgroundColor: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) < 0 ? bgError : "rgba(9,182,109,.17)",
                        color: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) < 0 ? textError : "#08ad6c",
                        width: "fit-content",
                        padding: "0.3125rem 1.125rem",
                        fontSize: "0.75rem",
                        '&:hover': {
                            backgroundColor: (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) < 0 ? textError : palette.success.main,
                            color: palette.common.white
                        }
                    }}>
                        {
                            (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) > 0
                                ? <ArrowDropUpIcon />
                                : <ArrowDropDownIcon />
                        }
                        <Span>
                            {
                                (
                                    (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) * 100
                                    / (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) < 1
                                    ? (
                                        (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) * 100
                                        / (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)
                                    ).toFixed(2)
                                    : numberFormatter((
                                        (data.avgMonthLikes - (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)) * 100
                                        / (data.avgLastMonthLikes === 0 ? 0.01 : data.avgLastMonthLikes)
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
