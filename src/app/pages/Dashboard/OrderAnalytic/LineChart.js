import React, { useState, useEffect } from 'react'
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { numberFormatter } from "../../../utils/utils"
import { H5 } from '../../../components/Typography';

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const LineChart = ({ subColor, data }) => {
    const [filterType, setFilterType] = useState("this_year");
    const { palette } = useTheme();
    const [value, setValue] = useState([]);

    useEffect(() => {
        setValue(months.map((_, month) => {
            let year = filterType === "this_year"
                ? new Date().getUTCFullYear()
                : new Date().getUTCFullYear() - 1;
            return data.reduce((acc1, order) => {
                let date = new Date(order.updatedAt);
                return acc1 + (
                    order.status === 1 &&
                        date.getMonth() === month && date.getUTCFullYear() === year
                        ? order.OrderDetails.reduce((acc2, detail) => acc2 + Number(detail.price) * detail.quantity, 0)
                        : 0
                );
            }, 0)
        }));
    }, [filterType, data])
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
        grid: {
            width: "90%",
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
            data: months,
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
            axisLabel: {
                interval: 10,
            },
            axisLabel: {
                formatter: function (value, index) {
                    return numberFormatter(value, 2) + " đ";
                },
                textStyle: {
                    color: subColor
                }
            }
        },
        series: [
            {
                data: value,
                type: 'line',
                symbolSize: 8,
                symbol: 'circle',
                itemStyle: {
                    borderWidth: 2,
                    borderColor: '#fff',
                },
                smooth: true,
                lineStyle: {
                    color: palette.primary.main,
                    width: 2,
                    shadowColor: palette.primary.light,
                    shadowBlur: 16,
                    shadowOffsetY: 10
                },
            }
        ],
        zoom: {
            zoomType: 'drag'
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
                }}>Doanh thu đơn hàng</H5>
                <Select size="small" value={filterType} onChange={(e) => {
                    setFilterType(e.target.value)
                }}>
                    <MenuItem value="this_year">Năm nay</MenuItem>
                    <MenuItem value="last_year">Năm trước</MenuItem>
                </Select>
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
