import { useNavigate } from 'react-router-dom';
import { Box, styled, Button, Tabs, Tab, Grid } from "@mui/material";
import { Breadcrumb, SimpleCard } from "../../components";
import BlogTable from "./tables/BlogTable";
import ReportTable from "./tables/ReportTable";
import SolvedTable from "./tables/SolvedTable";
import SolvedStatistic from "./SolvedStatistic";

import React, { useState } from 'react';
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
    const [isRender, setRender] = useState(false);

    const navigate = useNavigate();
    const [tabValue, setTabValue] = useState(0);

    return (
        <Container>
            <Box className="breadcrumb" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb routeSegments={[{ name: "Quản lý" }]} style={{
                    margin: 0
                }} />
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ my: 2 }}
                    onClick={() => navigate("/blog/add")}
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
                        label="Danh sách blog"
                    />
                    <Tab
                        {...a11yProps(1)}
                        label="Danh sách vi phạm"
                    />
                </Tabs>
            </Box>
            <TabPanel value={tabValue} index={0}>
                <SimpleCard title="Quản lý blog">
                    <BlogTable />
                </SimpleCard>

            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <SimpleCard title="Blog bị báo cáo">
                    <ReportTable render={setRender} isRender={isRender} />
                </SimpleCard>
                <Grid container spacing={2}>
                    <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2, height: "fit-content !important" }}>
                        <SimpleCard title="Blog đã xử lý">
                            <SolvedTable isRender={isRender} />
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, height: "fit-content !important" }}>
                        <SolvedStatistic />
                    </Grid>
                </Grid>
            </TabPanel>
        </Container>
    );
};

export default Management;