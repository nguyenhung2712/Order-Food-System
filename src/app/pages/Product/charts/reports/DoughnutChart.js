import React from 'react';
import { useTheme } from '@mui/system';
import { Box, Skeleton, Divider } from '@mui/material';
import ReactEcharts from 'echarts-for-react';
import { H5 } from '../../../../components/Typography';

const SolvedDChart = ({ height, data }) => {
    const theme = useTheme()
    const { palette } = useTheme();

    const option = {
        grid: {
            top: 0
        },
        legend: {
            show: true,
            type: 'scroll',
            icon: 'circle',
            bottom: 0,
            textStyle: {
                color: theme.palette.text.secondary,
                fontSize: 13,
                fontFamily: 'roboto',
            },
        },
        tooltip: {
            show: false,
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        xAxis: [
            {
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
        ],
        yAxis: [
            {
                axisLine: {
                    show: false,
                },
                splitLine: {
                    show: false,
                },
            },
        ],

        series: [
            {
                name: 'Type Rate',
                type: 'pie',
                radius: ['45%', '72.55%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                hoverOffset: 5,
                stillShowZeroSum: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center',
                        textStyle: {
                            color: theme.palette.text.secondary,
                            fontSize: 13,
                            fontFamily: 'roboto',
                        },
                        formatter: '{a}',
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '14',
                            fontWeight: 'normal',
                        },
                        formatter: '{b} \n{c} ({d}%)',

                    },

                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                data: data,
            },
        ],
    }
    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }
    return (
        <Box sx={{
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important",
            "borderRadius": "8px",
        }}>
            <Box sx={{
                display: "flex",
                padding: "16px",
                justifyContent: "space-between",
                alignItems: "center",
            }}>
                <H5 sx={{
                    fontSize: "18px"
                }}>Tỉ lệ lý do báo cáo</H5>
            </Box>
            <Divider sx={{
                "borderStyle": "solid",
                "borderColor": palette.text.primary
            }} />
            <ReactEcharts
                style={{ height: height, width: "100%" }}
                option={{ ...option }}
            />
        </Box>

    )
}

export default SolvedDChart;
