import React from 'react'
import { Divider, lighten } from "@mui/material"
import { useTheme } from '@mui/system'
import ReactEcharts from 'echarts-for-react'
import { SimpleCard, Breadcrumb } from "../../../components";
import 'echarts/lib/chart/heatmap';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/visualMap';

const hours = [
    '0h', '1h', '2h', '3h', '4h', '5h', '6h',
    '7h', '8h', '9h', '10h', '11h',
    '12h', '13h', '14h', '15h', '16h', '17h',
    '18h', '19h', '20h', '21h', '22h', '23h'
];

const days = [
    'Chủ nhật', 'Thứ hai', 'Thứ ba',
    'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'
];

const HeatMap = ({ data }) => {
    const option = {
        visualMap: {
            min: 1,
            max: 11,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 1,
            outOfRange: {
                color: '#4791db1f'
            },
            precision: 0,
            inRange: {
                color: ['#b2cfeb', '#1476de']
            }
        },
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return `${params.value[0]} giờ, ${days[params.value[1]]}: ${params.value[2]}`
            }
        },
        grid: {
            height: '80%',
            width: '80%',
            y: '10%'
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'category',
            data: days,
            axisLine: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            },
            axisTick: {
                show: false
            }
        },
        series: [{
            name: 'Blog upload Card',
            type: 'heatmap',
            data: data.heatmap,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
        }],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    }
    return (
        <SimpleCard
            title="Tần suất số lượng blog"
            sxTitle={{
                paddingLeft: "20px"
            }}
            sx={{
                paddingLeft: 0, paddingRight: 0
            }}
        >
            <ReactEcharts
                style={{ height: '400px', width: '100%' }}
                option={option}
            />

        </SimpleCard>
    )
}

export default HeatMap