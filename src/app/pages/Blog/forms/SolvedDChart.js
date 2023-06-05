import React from 'react'
import { useTheme } from '@mui/system'
import ReactEcharts from 'echarts-for-react'
import { convertToVND } from '../../../utils/utils';

const SolvedDChart = ({ height/* , color = [] */, data }) => {
    const theme = useTheme()

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
                            // color: "rgba(15, 21, 77, 1)"
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

    return (
        <ReactEcharts
            style={{ height: height, width: "100%" }}
            option={{
                ...option,
                /* color: [...color], */
            }}
        />
    )
}

export default SolvedDChart;
