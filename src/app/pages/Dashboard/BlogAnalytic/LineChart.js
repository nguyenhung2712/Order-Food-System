import React from 'react';
import { Divider, Skeleton, Box } from "@mui/material";
import ReactEcharts from 'echarts-for-react';
import { SimpleCard } from "../../../components";

const LineChart = ({ data, title, mainTitle, subTitle, mainColor }) => {

    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [mainTitle, subTitle],
            icon: "circle",
            left: "3%",
        },
        xAxis: {
            type: 'category',
            data: ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'],
            boundaryGap: false,
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: mainTitle,
                type: 'line',
                data: data.data,
                symbol: 'circle',
                symbolSize: 11,
                color: mainColor,
                lineStyle: {
                    color: mainColor,
                    width: 3
                }
            },
            {
                name: subTitle,
                type: 'line',
                data: data.avgData,
                symbolSize: 0,
                lineStyle: {
                    color: "#91909E",
                    width: 2
                },
                itemStyle: {
                    color: "#91909E"
                },
                colorBy: "series"
            },

        ],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    };
    if (!data.data || !data.avgData) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"370px"}
                />
            </Box>
        );
    }
    return (
        <SimpleCard
            title={title}
            sxTitle={{ paddingLeft: "20px" }}
            sx={{ paddingLeft: 0, paddingRight: 0 }}
        >
            <Divider sx={{ marginBottom: "20px" }} />
            <ReactEcharts
                option={option}
                style={{ height: '400px', width: '100%' }}
                opts={{ renderer: 'svg' }}

            />
        </SimpleCard >
    )
}

export default LineChart
