import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider, IconButton, Skeleton } from '@mui/material'
import ReactEcharts from 'echarts-for-react';
import { H5 } from '../../../../components/Typography';
import ReplayIcon from '@mui/icons-material/Replay';

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const weeks = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const LineChart = ({ subColor, data }) => {
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState("default_value");

    const [quantityData, setQuantityData] = useState([]);
    const { palette } = useTheme();

    const isFilteringMonth = monthFilter !== "default_value";

    useEffect(() => {
        if (data) {
            let reportQtt = (isFilteringMonth
                ? weeks.map((_, week) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            (new Date(report.createdAt)).getDay() === (week === 6 ? 0 : (week + 1)) &&
                                (new Date(report.createdAt)).getMonth() === monthFilter &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        );
                    }, 0)
                })
                : months.map((_, month) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            (new Date(report.createdAt)).getMonth() === month &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        )
                    }, 0)
                }));
            let unsolvedReportQtt = (isFilteringMonth
                ? weeks.map((_, week) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            report.status === 1 &&
                                (new Date(report.createdAt)).getDay() === (week === 6 ? 0 : (week + 1)) &&
                                (new Date(report.createdAt)).getMonth() === monthFilter &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        );
                    }, 0)
                })
                : months.map((_, month) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            report.status === 1 &&
                                (new Date(report.createdAt)).getMonth() === month &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        )
                    }, 0)
                }));
            let solvedReportQtt = (isFilteringMonth
                ? weeks.map((_, week) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            report.status === 2 &&
                                (new Date(report.createdAt)).getDay() === (week === 6 ? 0 : (week + 1)) &&
                                (new Date(report.createdAt)).getMonth() === monthFilter &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        );
                    }, 0)
                })
                : months.map((_, month) => {
                    return data.reduce((acc, report) => {
                        return acc + (
                            report.status === 2 &&
                                (new Date(report.createdAt)).getMonth() === month &&
                                (new Date(report.createdAt)).getFullYear() === yearFilter
                                ? 1
                                : 0
                        )
                    }, 0)
                }));
            let res = [
                {
                    name: 'Số lượng báo cáo',
                    type: 'line',
                    symbolSize: 8,
                    symbol: 'circle',
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#fff',
                    },
                    smooth: true,
                    data: reportQtt
                },
                {
                    name: 'Số lượng chưa xử lý',
                    type: 'line',
                    symbolSize: 8,
                    symbol: 'circle',
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#fff',
                    },
                    smooth: true,
                    data: unsolvedReportQtt
                },
                {
                    name: 'Số lượng đã xử lý',
                    type: 'line',
                    symbolSize: 8,
                    symbol: 'circle',
                    itemStyle: {
                        borderWidth: 2,
                        borderColor: '#fff',
                    },
                    smooth: true,
                    data: solvedReportQtt
                },
            ];
            setQuantityData(res);
        }
    }, [data, yearFilter, monthFilter]);
    const option = {
        legend: {
            show: true,
            icon: 'circle'
        },
        tooltip: {
            trigger: 'axis',
            show: 'true',
            axisPointer: {
                type: 'cross',
                position: function (pos, params, el, elRect, size) {
                    var obj = { top: 10 };
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                    return obj;
                },
                lineStyle: {
                    type: "dashed"
                }
            },
        },
        toolbox: {
            orient: 'vertical',
            itemSize: 20,
            itemGap: 10,
            feature: {
                saveAsImage: { show: true, title: 'Tải ảnh' }
            }
        },
        grid: {
            width: "85%",
            height: "75%",
            left: "6%",
            right: "0",
            top: "10%"
        },
        title: {
            show: false
        },
        xAxis: {
            type: 'category',
            data: isFilteringMonth ? weeks : months,
            nameLocation: 'start',
            axisLine: {
                lineStyle: {
                    color: "#C0C8D1"
                },
            },
            axisLabel: {
                textStyle: {
                    color: subColor
                }
            },
            axisTick: {
                show: false
            },
            boundaryGap: false,
        },
        yAxis: {
            type: 'value',
            name: 'Số lượng',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: quantityData,
        zoom: {
            zoomType: 'drag'
        },
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    };

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
                }}>Số lượng báo cáo</H5>
                <Box>
                    {
                        (yearFilter !== (new Date().getFullYear()) || monthFilter !== "default_value") &&
                        <IconButton onClick={() => {
                            setMonthFilter("default_value");
                            setYearFilter(new Date().getFullYear());
                        }}>
                            <ReplayIcon />
                        </IconButton>
                    }
                    <Select size="small" value={monthFilter}
                        onChange={(e) => {
                            setMonthFilter(e.target.value)
                        }}
                        sx={{
                            marginRight: "12px",
                            width: "120px"
                        }}
                    >
                        <MenuItem value="default_value">Chọn tháng</MenuItem>
                        {
                            months.map((text, month) => (
                                <MenuItem
                                    value={month}
                                    key={month}
                                >{text}</MenuItem>
                            ))
                        }
                    </Select>
                    <Select size="small" value={yearFilter}
                        onChange={(e) => {
                            setYearFilter(e.target.value)
                        }}
                        sx={{ width: "100px" }}
                    >
                        <MenuItem value={new Date().getFullYear()}>{new Date().getFullYear()}</MenuItem>
                        <MenuItem value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</MenuItem>
                        <MenuItem value={new Date().getFullYear() - 2}>{new Date().getFullYear() - 2}</MenuItem>
                    </Select>
                </Box>
            </Box>
            <Divider sx={{
                "borderStyle": "solid",
                "borderColor": palette.text.primary
            }} />
            <ReactEcharts
                style={{
                    width: "100%",
                    height: "310px",
                    padding: "12px 0"
                }}
                option={{ ...option }}
            />
        </Box >
    )
}

export default LineChart
