/* import { useState, useEffect } from "react"; */
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';

import { Stack, Grid, Tabs, Tab, Button } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "../../components";
import DetailInfo from "./forms/DetailInfo";
import OrderInfo from "./forms/OrderInfo";
import OrderService from "../../services/order.service";
import { convertToDateTimeStr } from "../../utils/utils";
import { TabPanel, a11yProps } from "../../components/TabPanel";
import UserInfo from './forms/UserInfo';

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState();
    const [tabValue, setTabValue] = useState(0);
    useEffect(() => {
        (async () => {
            await OrderService.getOrderById(id)
                .then(res => {
                    let order = res.data.payload;

                    setOrder({
                        details: order.OrderDetails,
                        number: order.number,
                        note: order.note,
                        user: order.user,
                        titleAddress: order.address.UserAddresses[0].title,
                        email: order.user.email,
                        createdAt: convertToDateTimeStr(order, "createdAt", false),
                        createdAtTime: convertToDateTimeStr(order, "createdAt", true),
                        street: order.address.address + ", " +
                            order.address.ward.wardName + " - " +
                            order.address.district.districtName + " - " +
                            order.address.province.provinceName,
                        phone: order.user.phoneNum ? order.user.phoneNum : "",
                        status: order.status === 4
                            ? "Đã nhận đơn"
                            : order.status === 3
                                ? "Đã duyệt"
                                : order.status === 2
                                    ? "Đang giao"
                                    : order.status === 1
                                        ? "Đã gửi hàng"
                                        : "Đã hủy"
                    });
                });
        })()
    }, [id]);
    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản lý", path: "/order/manage" }, { name: "Thông tin" }]} />
            </Box>

            <Stack spacing={3}>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2, height: "fit-content" }}>
                        <Box>
                            <Tabs
                                value={tabValue}
                                onChange={(event, newValue) => setTabValue(newValue)}
                                sx={{
                                    border: "none"
                                }}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs"
                            >
                                <Tab
                                    {...a11yProps(0)}
                                    label="Hóa đơn (In)"
                                />
                                <Tab
                                    {...a11yProps(1)}
                                    label="Chi tiết"
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabValue} index={0}>
                            {
                                order &&
                                <SimpleCard
                                    sxTitle={{ display: "none" }}
                                >
                                    <OrderInfo data={order} />
                                </SimpleCard>
                            }

                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            {
                                order &&
                                <Grid container spacing={2}>
                                    <Grid item lg={8} md={12} sm={12} xs={12} sx={{ height: "fit-content" }}>
                                        <SimpleCard
                                            title={`Đơn hàng #${order.number}`}
                                            sx={{ position: "relative" }}
                                        >
                                            <DetailInfo data={order} />
                                        </SimpleCard>
                                    </Grid>

                                    <Grid item lg={4} md={12} sm={12} xs={12} sx={{ height: "fit-content" }}>
                                        <SimpleCard
                                            title={"Thông tin khách hàng"}
                                            sxTitle={{ paddingLeft: "20px" }}
                                            sx={{ paddingRight: 0, paddingLeft: 0, position: "relative", paddingBottom: 0 }}
                                        >
                                            <UserInfo data={order.user} />
                                            <Button
                                                sx={{ position: "absolute", top: "12px", right: "12px" }}
                                                onClick={() => navigate(`/customer/${order.user.id}`)}
                                            >Chi tiết</Button>
                                        </SimpleCard>
                                    </Grid>
                                </Grid>

                            }
                        </TabPanel>
                    </Grid>
                </Grid>
            </Stack>
        </Container>
    );
};

export default ProductDetail;
