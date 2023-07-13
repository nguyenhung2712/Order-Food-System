import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider, IconButton, Skeleton } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { numberFormatter } from "../../../utils/utils"
import { H5 } from '../../../components/Typography';
import ReplayIcon from '@mui/icons-material/Replay';

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
const weeks = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const BarChart = ({ data }) => {
    const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
    const [monthFilter, setMonthFilter] = useState("default_value");
    const [types, setTypes] = useState([]);

    const [chartData, setChartData] = useState([]);
    const { palette } = useTheme();

    const isFilteringMonth = monthFilter !== "default_value";

    useEffect(() => {
        if (data) {
            let temp = data.map(type => {
                return {
                    name: type.typeName,
                    barWidth: 15,
                    type: 'bar',
                    itemStyle: {
                        borderRadius: [8, 8, 0, 0],
                        /* color: '#67C23A' */
                    },
                    data: isFilteringMonth
                        ? weeks.map((_, week) => {
                            return type.Dishes.reduce((acc1, dish) => {
                                return acc1 + dish.OrderDetails.reduce((acc2, detail) => {
                                    return acc2 + (
                                        detail.order.status === 1 &&
                                            (new Date(detail.order.updatedAt)).getDay() === (week === 6 ? 0 : (week + 1)) &&
                                            (new Date(detail.order.updatedAt)).getMonth() === monthFilter &&
                                            (new Date(detail.order.updatedAt)).getFullYear() === yearFilter
                                            ? Number(detail.price) * detail.quantity
                                            : 0
                                    );
                                }, 0);
                            }, 0)
                        })
                        : months.map((_, month) => {
                            return type.Dishes.reduce((acc1, dish) => {
                                return acc1 + dish.OrderDetails.reduce((acc2, detail) => {
                                    return acc2 + (
                                        detail.order.status === 1 &&
                                            (new Date(detail.order.updatedAt)).getMonth() === month &&
                                            (new Date(detail.order.updatedAt)).getFullYear() === yearFilter
                                            ? Number(detail.price) * detail.quantity
                                            : 0
                                    );
                                }, 0);
                            }, 0)
                        })
                }
            });

            setTypes(data.map(type => type.typeName));
            setChartData(temp);
        }
    }, [data, yearFilter, monthFilter]);

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
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
            width: "80%",
            height: "65%",
            top: "20%",
            bottom: "20%",
            right: "0",
            left: "10%"
        },
        legend: {
            show: true,
            itemGap: 20,
            data: types,
            icon: 'circle',
            textStyle: {
                color: palette.text.secondary,
                fontSize: 13
            },
        },
        xAxis: {
            type: 'category',
            data: isFilteringMonth ? weeks : months,
            axisLabel: {
                interval: 0
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (index === 0) {
                            return '';
                        } else {
                            return numberFormatter(value) + " đ";
                        }
                    }
                }
            }
        ],
        series: chartData,
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
                }}>Doanh thu từng loại</H5>
                <Box>
                    {
                        (monthFilter !== "default_value" || yearFilter !== (new Date().getFullYear())) &&
                        <IconButton onClick={() => {
                            setYearFilter(new Date().getFullYear());
                            setMonthFilter("default_value");
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
                    height: "350px",
                    padding: "12px 0"
                }}
                option={{ ...option }}
            />
        </Box>
    )
}

export default BarChart
