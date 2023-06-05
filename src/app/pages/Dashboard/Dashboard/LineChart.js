import React from 'react'
import { useTheme } from '@mui/system'
import ReactEcharts from 'echarts-for-react'
import { numberFormatter } from "../../../utils/utils"

const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];

const LineChart = ({ title, subColor, titleColor, color, data }) => {

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
            width: "95%",
            left: "6%",
            right: "0"
        },
        title: {
            text: title,
            textStyle: {
                color: titleColor
            }
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLine: {
                lineStyle: {
                    color: "#2A80D5"
                },
            },
            axisLabel: {
                textStyle: {
                    color: subColor
                }
            }
        },
        yAxis: {
            type: 'value',
            splitLine: {
                lineStyle: {
                    color: "#2A80D5"
                }
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
                data: data,
                type: 'line',
                smooth: true
            }
        ]
    };

    return (
        <ReactEcharts
            style={{
                width: "100%",
                height: "350px"
            }}
            option={{
                ...option,
                color: color,
            }}
        />
    )
}

export default LineChart
