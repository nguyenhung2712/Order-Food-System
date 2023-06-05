import React from 'react'
import { useTheme } from '@mui/system'
import ReactEcharts from 'echarts-for-react'
import { convertToVND } from '../../../utils/utils';
import "./OrderAnalytic.css";

const PODoughnut = ({ data }) => {
    const { palette } = useTheme();
    var colorList = [palette.error.main, palette.warning.main, palette.primary.main];
    const option = {
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                labelLine: {
                    show: false
                },
                data: data,
                itemStyle: {
                    normal: {
                        color: function (params) {
                            return colorList[params.dataIndex];
                        }
                    }
                }
            }
        ],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    };
    return (
        <ReactEcharts
            className="po-doughnut-chart"
            style={{ width: "100%" }}
            option={{
                ...option,
            }}
        />
    )
}

export default PODoughnut