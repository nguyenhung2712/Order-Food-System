import { Box, Select, Grid, MenuItem, Skeleton, Divider, useTheme } from '@mui/material';
import { Paragraph, H5, H4 } from '../../../components/Typography';
import React, { useState, useEffect } from 'react';
import { convertToVND, getFirstAndLastDate } from '../../../utils/utils';
import PODoughnut from './PODoughnut';

const PurchaseOrder = ({ data }) => {
    const { palette } = useTheme();
    const [filterType, setFilterType] = useState("this_month");
    const [purchaseValue, setPurValue] = useState();
    useEffect(() => {
        if (data) {
            setPurValue({
                quantity: data.orders.filter(order => {
                    switch (filterType) {
                        case "last_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return (
                                [1, 2, 3, 4].includes(order.status) &&
                                new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                new Date(order.updatedAt).getTime() >= firstDate.getTime())
                        }
                        case "last_6_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(6);
                            return (
                                [1, 2, 3, 4].includes(order.status) &&
                                new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                new Date(order.updatedAt).getTime() >= firstDate.getTime())
                        }
                        case "last_year": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1, true);
                            return (
                                [1, 2, 3, 4].includes(order.status) &&
                                new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                new Date(order.updatedAt).getTime() >= firstDate.getTime())
                        }
                        default: {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return (
                                [1, 2, 3, 4].includes(order.status) &&
                                new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                new Date(order.updatedAt).getTime() >= firstDate.getTime())
                        }
                    }
                }).length,
                revenue: convertToVND(data.orders.reduce((acc1, order) => {
                    switch (filterType) {
                        case "last_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return acc1 + (
                                order.status === 1 &&
                                    new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                    new Date(order.updatedAt).getTime() >= firstDate.getTime()
                                    ? order.OrderDetails.reduce((acc2, detail) => acc2 + Number(detail.price) * detail.quantity, 0)
                                    : 0
                            )
                        }
                        case "last_6_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(6);
                            return acc1 + (
                                order.status === 1 &&
                                    new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                    new Date(order.updatedAt).getTime() >= firstDate.getTime()
                                    ? order.OrderDetails.reduce((acc2, detail) => acc2 + Number(detail.price) * detail.quantity, 0)
                                    : 0
                            )
                        }
                        case "last_year": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1, true);
                            return acc1 + (
                                order.status === 1 &&
                                    new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                    new Date(order.updatedAt).getTime() >= firstDate.getTime()
                                    ? order.OrderDetails.reduce((acc2, detail) => acc2 + Number(detail.price) * detail.quantity, 0)
                                    : 0
                            )
                        }
                        default: {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return acc1 + (
                                order.status === 1 &&
                                    new Date(order.updatedAt).getTime() <= lastDate.getTime() &&
                                    new Date(order.updatedAt).getTime() >= firstDate.getTime()
                                    ? order.OrderDetails.reduce((acc2, detail) => acc2 + Number(detail.price) * detail.quantity, 0)
                                    : 0
                            )
                        }
                    }
                }, 0))
            })
        }
    }, [data, filterType]);

    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"310px"}
                />
            </Box>
        );
    }

    return (
        <Box sx={{
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important",
            padding: "12px 20px",
            "borderRadius": "8px",
        }}>
            <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
                <Grid item lg={7} md={7} sm={7} xs={12}>
                    <Box sx={{
                        "display": "flex",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                        "paddingTop": "12px",
                        "paddingBottom": "12px",
                        color: palette.error.light
                    }}>
                        <H5>{data.stockData.filter(st => st.id === "stockout")[0].name}</H5>
                        <H5>{data.stockData.filter(st => st.id === "stockout")[0].value}</H5>
                    </Box>
                    <Box sx={{
                        "display": "flex",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                        "paddingTop": "12px",
                        "paddingBottom": "12px",
                    }}>
                        <H5>{data.stockData.filter(st => st.id === "low-stock")[0].name}</H5>
                        <H5 sx={{ margin: "18px 0" }}>{data.stockData.filter(st => st.id === "low-stock")[0].value}</H5>
                    </Box>
                    <Box sx={{
                        "display": "flex",
                        "alignItems": "center",
                        "justifyContent": "space-between",
                        "paddingTop": "12px",
                        "paddingBottom": "12px",
                    }}>
                        <H5>{data.stockData.filter(st => st.id === "in-stock")[0].name}</H5>
                        <H5>{data.stockData.filter(st => st.id === "in-stock")[0].value}</H5>
                    </Box>
                </Grid>
                <Grid item lg={5} md={5} sm={5} xs={12}>
                    <PODoughnut data={data.stockData.map(st => ({ name: st.name, value: st.value }))} />
                </Grid>
            </Grid>
            <Divider sx={{
                "margin": "24px 0px 0px",
                "flexShrink": "0",
                "borderStyle": "solid",
                "borderColor": palette.text.primary
            }} />
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "16px"
            }}>
                <H5 sx={{
                    fontSize: "18px"
                }}>Đơn hàng</H5>
                <Select size="small" value={filterType} onChange={(e) => {
                    setFilterType(e.target.value)
                }}>
                    <MenuItem value="this_month">Tháng này</MenuItem>
                    <MenuItem value="last_month">Tháng trước</MenuItem>
                    <MenuItem value="last_6_month">6 Tháng trước</MenuItem>
                    <MenuItem value="last_year">Năm trước</MenuItem>
                </Select>
            </Box>
            <Box sx={{
                display: "flex",
                justifyContent: "space-around"
            }}>
                <Box sx={{
                    padding: "12px 0",
                    textAlign: "center"
                }}>
                    <Paragraph sx={{ margin: "12px 0" }}>Số lượng được đặt</Paragraph>
                    <H4 sx={{
                        "marginBottom": "0px", "marginTop": "0px",
                        "fontSize": "16px", "fontWeight": "500",
                        "lineHeight": "1.5", "textTransform": "none",
                        "color": "rgb(25, 118, 210)"
                    }}>{purchaseValue && purchaseValue.quantity}</H4>
                </Box>
                <Divider sx={{
                    "margin": "24px 0px 0px",
                    "flexShrink": "0",
                    "borderStyle": "solid",
                    "borderColor": palette.text.primary
                }} />
                <Box sx={{
                    padding: "12px 0",
                    textAlign: "center"
                }}>
                    <Paragraph sx={{ margin: "12px 0" }}>Tổng thu được</Paragraph>
                    <H4 sx={{
                        "marginBottom": "0px", "marginTop": "0px",
                        "fontSize": "16px", "fontWeight": "500",
                        "lineHeight": "1.5", "textTransform": "none",
                        "color": "rgb(25, 118, 210)"
                    }}>{purchaseValue && purchaseValue.revenue}</H4>
                </Box>
            </Box>
        </Box>
    );
};

export default PurchaseOrder;
