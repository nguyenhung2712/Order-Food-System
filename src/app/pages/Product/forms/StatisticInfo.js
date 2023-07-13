import React from 'react';
import { Grid, Card, Skeleton, Box } from "@mui/material";
import LineChart from "../charts/details/LineChart";
import Rate1DoughnutChart from "../charts/details/Rate1DoughnutChart";
import Rate2DoughnutChart from "../charts/details/Rate2DoughnutChart";

const StatisticInfo = ({ data }) => {
    if (!data) {
        return (
            <Grid container spacing={1}>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Box sx={{ width: "100%", marginBottom: "12px" }}>
                        <Skeleton
                            variant="rounded" width={"100%"}
                            height={"350px"}
                        />
                    </Box>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Box sx={{ width: "100%", marginBottom: "12px" }}>
                        <Skeleton
                            variant="rounded" width={"100%"}
                            height={"350px"}
                        />
                    </Box>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Box sx={{ width: "100%", marginBottom: "12px" }}>
                        <Skeleton
                            variant="rounded" width={"100%"}
                            height={"450px"}
                        />
                    </Box>
                </Grid>
            </Grid>
        );
    }
    return (
        <Grid container spacing={4}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
                <Card sx={{ px: 3, py: 2 }}>
                    <Rate1DoughnutChart data={data} height="300px" />
                </Card>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
                <Card sx={{ px: 3, py: 2 }}>
                    <Rate2DoughnutChart data={data} height="300px" />
                </Card>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <LineChart data={data} />
            </Grid>
        </Grid>
    )
}

export default StatisticInfo