import React, { useState } from 'react'
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { numberFormatter } from "../../../utils/utils"
import { H5 } from '../../../components/Typography';

const BarChart = ({ /* title, subColor, titleColor, color, months, data */months }) => {
    const [filterType, setFilterType] = useState("this_month");
    const { palette } = useTheme();

    const option = {
        tooltip: {
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            width: "92s%",
            height: "75%",
            top: "10%",
            right: "0",
            left: "5%"
        },
        legend: {
            data: ['Sản phẩm 1', 'Sản phẩm 2']
        },
        xAxis: {
            type: 'category',
            data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'],
            axisLabel: {
                interval: 0
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Sản phẩm 1',
                type: 'bar',
                data: [320, 302, 301, 334, 390, 330, 320],
                barWidth: 15,
                itemStyle: {
                    borderRadius: [5, 5, 0, 0],
                    color: '#67C23A'
                }
            },
            {
                name: 'Sản phẩm 2',
                type: 'bar',
                data: [220, 182, 191, 234, 290, 210, 220],
                barWidth: 15,
                itemStyle: {
                    borderRadius: [5, 5, 0, 0],
                    color: '#F56C6C'
                }
            }
        ],
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
                }}>Doanh thu từng loại</H5>
                <Select size="small" value={filterType} onChange={(e) => {
                    setFilterType(e.target.value)
                }}>
                    <MenuItem value="this_month">Tháng này</MenuItem>
                    <MenuItem value="last_month">Tháng trước</MenuItem>
                    <MenuItem value="last_6_month">6 Tháng trước</MenuItem>
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
                    ...option
                }}
            />
        </Box>
    )
}

export default BarChart
