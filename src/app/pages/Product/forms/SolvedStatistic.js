import { Grid } from "@mui/material";
import { SimpleCard } from "../../../components";
import AnalyticService from '../../../services/analytic.service';

import DoughnutChart from "../charts/reports/DoughnutChart";
import LineChart from "../charts/reports/LineChart";

import React, { useState, useEffect } from 'react';
const SolvedStatistic = ({ onSetProgress, onSetLoading }) => {
    const [reasons, setReasons] = useState();
    const [reportData, setReportData] = useState();
    useEffect(() => {
        onSetLoading(true);
        (async () => {
            await AnalyticService.getRatingReportInfo({
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    onSetProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            onSetLoading(false);
                        }, 600);
                    }
                },
            })
                .then(res => {
                    let { ratingReasons, ratingReports } = res.data.payload;
                    setReasons(ratingReasons);
                    setReportData(ratingReports);
                });
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