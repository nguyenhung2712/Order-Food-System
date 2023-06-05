
import SolvedDChart from "./forms/SolvedDChart";
import PeriodCard from "./forms/PeriodCard";
import { Box, useTheme } from "@mui/material";
import { SimpleCard } from "../../components";
import AnalyticService from '../../services/analytic.service';
import { getFirstAndLastDate } from '../../utils/utils';

import React, { useState, useEffect } from 'react';
const SolvedStatistic = () => {
    const { palette } = useTheme()
    const [reasons, setReasons] = useState();
    const [totalReportData, setTotalData] = useState();
    useEffect(() => {
        (async () => {
            await AnalyticService.getReportInfo()
                .then(res => {
                    setReasons(res.data.payload.blogReasons);
                    setTotalData({
                        month: res.data.payload.blogReports.filter(interact => {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return (
                                (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                            )
                        }).length,
                        lastMonth: res.data.payload.blogReports.filter(interact => {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);

                            return (
                                (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                            )
                        }).length,
                    })
                })
        })()
    }, []);
    return (
        <>
            <SimpleCard title="Tỉ lệ lý do">
                <SolvedDChart
                    data={reasons}
                    height="300px"
                /* color={[palette.primary.dark, palette.primary.main, palette.primary.light]} */
                />
            </SimpleCard>
            <Box sx={{ marginTop: "24px" }}>
                {
                    totalReportData &&
                    <PeriodCard data={totalReportData} />
                }
            </Box>
        </>
    )
}

export default SolvedStatistic