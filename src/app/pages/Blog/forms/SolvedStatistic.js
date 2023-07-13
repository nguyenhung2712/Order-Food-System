
import DoughnutChart from "../charts/reports/DoughnutChart";
import { Box, useTheme, Grid } from "@mui/material";
import { SimpleCard } from "../../../components";
import AnalyticService from '../../../services/analytic.service';
import { getFirstAndLastDate } from '../../../utils/utils';
import LineChart from "../charts/reports/LineChart"
import React, { useState, useEffect } from 'react';

const SolvedStatistic = () => {
    const { palette } = useTheme()
    const [reasons, setReasons] = useState();
    const [reportData, setReportData] = useState();
    useEffect(() => {
        (async () => {
            await AnalyticService.getBlogReportInfo()
                .then(res => {
                    let { blogReasons, blogReports } = res.data.payload;
                    setReasons(blogReasons);
                    setReportData(blogReports);
                })
        })()
    }, []);
    return (
        <Grid container spacing={2}>
            <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2, height: "fit-content !important" }}>
                <LineChart data={reportData} />
            </Grid>
            <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, height: "fit-content !important" }}>

                <DoughnutChart
                    data={reasons}
                    height="300px"
                />
            </Grid>
        </Grid>
    )
}

export default SolvedStatistic