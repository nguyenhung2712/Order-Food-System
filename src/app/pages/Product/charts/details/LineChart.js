import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider, IconButton } from '@mui/material'
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

    const timeCondition = ({ date, isMonth, week, month }) => {
        if (isMonth) {
            return date.getDay() === (week === 6 ? 0 : (week + 1)) &&
                date.getMonth() === monthFilter &&
                date.getFullYear() === yearFilter
        } else {
            return date.getMonth() === month &&
                date.getFullYear() === yearFilter
        }
    }

    useEffect(() => {
        let details = data.OrderDetails, views = data.Interacts;
        let viewQuantity = (isFilteringMonth
            ? weeks.map((_, week) => {
                return views.filter((view) => {
                    return view.type === 3 && timeCondition({
                        date: new Date(view.createdAt),
                        isMonth: true,
                        week: week
                    })
                }).length
            })
            : months.map((_, month) => {
                return views.filter((view) => {
                    return timeCondition({
                        date: new Date(view.createdAt),
                        isMonth: false,
                        month: month
                    })
                }).length
            }));
        let orderQuantity = (isFilteringMonth
            ? weeks.map((_, week) => {
                return details.filter((detail) => {
                    return timeCondition({
                        date: new Date(detail.createdAt),
                        isMonth: true,
                        week: week
                    })
                }).length
            })
            : months.map((_, month) => {
                return details.filter((detail) => {
                    return timeCondition({
                        date: new Date(detail.createdAt),
                        isMonth: false,
                        month: month
                    })
                }).length
            }));
        let numberOrder = (isFilteringMonth
            ? weeks.map((_, week) => {
                return details.reduce((acc, detail) => {
                    return acc + (
                        timeCondition({
                            date: new Date(detail.createdAt),
                            isMonth: true,
                            week: week
                        })
                            ? detail.quantity
                            : 0
                    )
                }, 0)
            })
            : months.map((_, month) => {
                return details.reduce((acc, detail) => {
                    return acc + (
                        timeCondition({
                            date: new Date(detail.createdAt),
                            isMonth: false,
                            month: month
                        })
                            ? detail.quantity
                            : 0
                    )
                }, 0)
            }));
        setQuantityData([
            {
                data: viewQuantity,
                type: 'line',
                name: "Lượt xem",
                symbolSize: 8,
                symbol: 'circle',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff',
                },
                smooth: true,
            },
            {
                data: orderQuantity,
                type: 'line',
                name: "Lượt mua",
                symbolSize: 8,
                symbol: 'circle',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff',
                },
                smooth: true,
            },
            {
                data: numberOrder,
                type: 'line',
                name: "Số lượng mua",
                symbolSize: 8,
                symbol: 'circle',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff',
                },
                smooth: true,
            },
        ])
    }, [data, yearFilter, monthFilter]);
    const option = {
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
            /* axisLine: {
                lineStyle: {
                    color: "#C0C8D1"
                },
            }, */
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
                }}>Thông số</H5>
                <Box>
                    {
                        (monthFilter !== "default_value" || yearFilter !== (new Date().getFullYear())) &&
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
                            marginRight: "12px"
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
                    height: "350px",
                    padding: "12px 0"
                }}
                option={{
                    ...option,
                }}
            />
        </Box>
    )
}

export default LineChart
