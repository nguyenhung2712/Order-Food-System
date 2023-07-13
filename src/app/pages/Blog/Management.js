import { useNavigate } from 'react-router-dom';
import { Box, styled, Button, Tabs, Tab, LinearProgress } from "@mui/material";
import { Breadcrumb, SimpleCard } from "../../components";
import BlogTable from "./tables/BlogTable";
import ReportedBlogTable from "./tables/ReportedBlogTable";
import SolvedStatistic from "./forms/SolvedStatistic";

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
                <Box className="" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Breadcrumb routeSegments={[{ name: "Quản lý blog" }]} />
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
                            label="Danh sách blog vi phạm"
                        />
                        <Tab
                            {...a11yProps(1)}
                            label="Danh sách bình luận vi phạm"
                        />
                    </Tabs>
                </Box>
                <TabPanel value={tabValue} index={0}>
                    <SimpleCard title="Quản lý blog">
                        <BlogTable
                            onSetLoading={setLoading}
                            onSetProgress={setProgress}
                        />
                    </SimpleCard>

                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                    <SimpleCard title="Danh sách blog vi phạm">
                        <ReportedBlogTable render={setRender} isRender={isRender}
                            onSetLoading={setLoading}
                            onSetProgress={setProgress}
                        />
                    </SimpleCard>
                    <SolvedStatistic
                        onSetLoading={setLoading}
                        onSetProgress={setProgress}
                    />
                </TabPanel>
                {/* <TabPanel value={tabValue} index={2}>
                    <SimpleCard title="Danh sách bình luận vi phạm">
                        <ReportedBlogTable render={setRender} isRender={isRender} />
                    </SimpleCard>
                    <SolvedStatistic
                        onSetLoading={setLoading}
                        onSetProgress={setProgress}
                    />
                </TabPanel> */}
            </Container>
        </>
    );
};

export default Management;