import React from "react";
import ReactECharts from "echarts-for-react";
import vnGeoJson from "../../../utils/vn.geo.json";
import usaGeoJson from "../../../utils/usa.geo.json";
import * as echarts from "echarts";
import { useTheme } from '@mui/system'
import { Select, MenuItem, Box, Divider } from '@mui/material'
import { numberFormatter } from "../../../utils/utils"

const MapChart = ({ data }) => {
    const { palette } = useTheme();
    echarts.registerMap('VN', vnGeoJson);

    const option = {
        title: {
            text: 'USA Population Estimates (2012)',
            subtext: 'Data from www.census.gov',
            sublink: 'http://www.census.gov/popest/data/datasets.html',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2
        },
        visualMap: {
            left: 'right',
            min: 500000,
            max: 38000000,
            inRange: {
                color: [
                    '#313695',
                    '#4575b4',
                    '#74add1',
                    '#abd9e9',
                    '#e0f3f8',
                    '#ffffbf',
                    '#fee090',
                    '#fdae61',
                    '#f46d43',
                    '#d73027',
                    '#a50026'
                ]
            },
            text: ['High', 'Low'],
            calculable: true
        },
        toolbox: {
            show: true,
            //orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
                dataView: { readOnly: false },
                restore: {},
                saveAsImage: {}
            }
        },
        series: [
            {
                name: 'USA PopEstimates',
                type: 'map',
                map: 'VN',
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: data
            }
        ]
    };
    return (
        <Box sx={{
            backgroundColor: palette.background.paper,
            color: palette.text.primary,
            "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important",
            "borderRadius": "8px",
        }}>
            <ReactECharts
                option={option}
                style={{ height: "600px", width: "100%" }}
            />
        </Box>

    );
}

export default MapChart;