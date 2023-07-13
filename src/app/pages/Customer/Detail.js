import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import React from 'react';

import { Grid, Tab, Tabs, LinearProgress } from "@mui/material";
import { Box, styled } from "@mui/system";

import { Breadcrumb, SimpleCard } from "../../components";
import BillInfo from "./forms/BillInfo";
import CustomerInfo from "./forms/CustomerInfo";
import ActionsForm from "./forms/ActionsForm";
import SendMailForm from "./forms/SendMailForm";

import OrderService from "../../services/order.service";
import UserService from "../../services/user.service";
import TrackerService from "../../services/tracker.service";

import { TabPanel, a11yProps } from "../../components/TabPanel";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const CustomerDetail = () => {
    const { id } = useParams();
    const [state, setState] = useState();
    const [orders, setOrders] = useState();
    const [histories, setHistories] = useState();
    const [value, setValue] = useState(0);
    const [render, setRender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        setLoading(true);
        (async () => {
            await UserService.getUserById(id)
                .then(async (res) => {
                    let user = res.data.payload;
                    setState(user);
                    await TrackerService.getHistoryByUser(user.id, {
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
                            setHistories(res.data.payload);
                        })
                })
            await OrderService.getOrderByUser(id)
                .then((res) => {
                    setOrders(res.data.payload);
                })
        })()
    }, [render]);

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
                    <Breadcrumb routeSegments={[{ name: "Quản lý khách hàng", path: "/customer/manage" }, { name: "Thông tin khách hàng" }]} />
                </Box>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                    >
                        <Tab label="Thông tin" {...a11yProps(0)} />
                        <Tab label="Hóa đơn" {...a11yProps(1)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }} component="div">
                            <SimpleCard
                                title="Thông tin người dùng"
                                sxTitle={{ paddingLeft: "20px" }}
                                sx={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}
                            >
                                <CustomerInfo data={state} />
                            </SimpleCard>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }}>
                            <SimpleCard
                                title="Gửi mail"
                                sxTitle={{ paddingLeft: "20px" }}
                                sx={{ padding: "16px 0 0" }}
                            >
                                <SendMailForm
                                    user={state}
                                    histories={histories}
                                />
                            </SimpleCard>
                        </Grid>
                        <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }}>
                            <SimpleCard
                                title="Các tác vụ khác"
                                sxTitle={{ paddingLeft: "20px" }}
                                sx={{ paddingRight: 0, paddingLeft: 0 }}
                            >
                                <ActionsForm
                                    data={state}
                                    setRender={setRender}
                                />
                            </SimpleCard>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <SimpleCard title="Thông tin hóa đơn" >
                        <BillInfo
                            data={orders}
                        />
                    </SimpleCard>
                </TabPanel>
            </Container>
        </>
    );
};

export default CustomerDetail;
