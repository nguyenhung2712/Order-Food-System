/* import { useState, useEffect } from "react"; */
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react';
import { useState, useEffect } from 'react';

import { Stack, Grid, Tabs, Tab, Button, LinearProgress } from "@mui/material";
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

const ProductDetail = ({ }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState();
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setLoading(true);
        (async () => {
            await OrderService.getOrderById(id, {
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    setProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 600);
                    }
                },
            })
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
                        phone: order.user.phoneNum,
                        status: order.status
                    });
                });
        })()
    }, [id]);
    return (
        <>
            {
                loading && <LinearProgress
                    sx={{ position: "absolute", width: "100%" }}
                    variant="determinate"
                    value={progress}
                />
            }
            <Container>
                <Box className="breadcrumb">
                    <Breadcrumb routeSegments={[{ name: "Quản lý đơn hàng", path: "/order/manage" }, { name: "Thông tin đơn" }]} />
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
                                        label="Chi tiết"
                                    />
                                    <Tab
                                        {...a11yProps(1)}
                                        label="Hóa đơn (In)"
                                    />
                                </Tabs>
                            </Box>
                            <TabPanel value={tabValue} index={1}>
                                <SimpleCard sxTitle={{ display: "none" }}  >
                                    <OrderInfo data={order} />
                                </SimpleCard>
                            </TabPanel>
                            <TabPanel value={tabValue} index={0}>
                                <Grid container spacing={2}>
                                    <Grid item lg={8} md={12} sm={12} xs={12} sx={{ height: "fit-content" }}>
                                        <SimpleCard
                                            title={`Đơn hàng #${order ? order.number : "..."}`}
                                            sx={{ position: "relative" }}
                                        >
                                            {
                                                order &&
                                                <DetailInfo data={order} />
                                            }
                                        </SimpleCard>
                                    </Grid>

                                    <Grid item lg={4} md={12} sm={12} xs={12} sx={{ height: "fit-content" }}>
                                        <SimpleCard
                                            title={"Thông tin khách hàng"}
                                            sxTitle={{ paddingLeft: "20px" }}
                                            sx={{ paddingRight: 0, paddingLeft: 0, position: "relative", paddingBottom: 0 }}
                                        >
                                            <UserInfo data={order} />
                                            {
                                                order &&
                                                <Button
                                                    sx={{ position: "absolute", top: "12px", right: "12px" }}
                                                    onClick={() => navigate(`/customer/${order.user.id}`)}
                                                >Chi tiết</Button>
                                            }
                                        </SimpleCard>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </>
    );
};

export default ProductDetail;
