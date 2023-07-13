import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Box, styled, Button, LinearProgress, Tabs, Tab } from "@mui/material";
import { Breadcrumb, SimpleCard } from "../../components";
import CustomerTable from "./tables/CustomerTable";
import { TabPanel, a11yProps } from "../../components/TabPanel";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const Management = () => {

    const navigate = useNavigate();
    const [isRender, setRender] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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
                <Box className="breadcrumb" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumb routeSegments={[{ name: "Quản lý khách hàng" }]} />
                    <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        sx={{ my: 2 }}
                        onClick={() => navigate("/customer/add")}
                    >
                        Thêm mới
                    </Button>
                </Box>
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
                            label="Danh sách khách hàng"
                        />
                        <Tab
                            {...a11yProps(1)}
                            label="Danh sách vi phạm"
                        />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <SimpleCard title="Quản lý khách hàng">
                        <CustomerTable
                            onSetLoading={setLoading}
                            onSetProgress={setProgress}
                        />
                    </SimpleCard>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    {/* <SimpleCard title="Danh sách đánh giá vi phạm">
                        <ReportedRateTable render={setRender} isRender={isRender}
                            onSetLoading={setLoading}
                            onSetProgress={setProgress}
                        />
                    </SimpleCard>
                    <SolvedStatistic
                        onSetLoading={setLoading}
                        onSetProgress={setProgress}
                    /> */}
                </TabPanel>

            </Container>
        </>
    );
};

export default Management;