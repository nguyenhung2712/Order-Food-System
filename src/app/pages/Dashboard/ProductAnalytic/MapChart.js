import React, { useState, useEffect } from 'react'
import ReactECharts from "echarts-for-react";
import vnGeoJson from "../../../utils/vn.geo.json";
import * as echarts from "echarts";
import { useTheme } from '@mui/system'
import { Box, Skeleton } from '@mui/material';

const MapChart = ({ provinceData, data }) => {
    const { palette } = useTheme();
    echarts.registerMap('VN', vnGeoJson);
    const [chartData, setChartData] = useState([]);
    useEffect(() => {
        if (data) {
            let temp = provinceData.map(province => {
                let provinceName = province.provinceName;
                if (Number(province.id) === 46) {
                    provinceName = "Thừa Thiên - Huế";
                }
                if (Number(province.id) === 79) {
                    provinceName = "Hồ Chí Minh city";
                }
                if (Number(province.id) === 67) {
                    provinceName = "Đăk Nông";
                }
                if (Number(province.id) === 17) {
                    provinceName = "Hòa Bình";
                }
                return {
                    name: provinceName,
                    value: data.reduce((acc, detail) => {
                        return acc + (
                            detail.order.address.province.provinceName === provinceName && detail.order.status === 1
                                ? detail.quantity
                                : 0
                        )
                    }, 0)
                }
            });
            setChartData(temp);
        }
    }, [provinceData, data])
    const option = {
        title: {
            text: 'Số lượng mua ở mỗi tỉnh',
            left: 'right'
        },
        tooltip: {
            trigger: 'item',
            showDelay: 0,
            transitionDuration: 0.2
        },
        visualMap: {
            left: 'right',
            calculable: true,
            outOfRange: {
                color: '#4791db1f'
            },
            precision: 0,
            inRange: {
                color: ['#e6ecf2', '#1476de']
            },
            text: ['Cao nhất', 'Thấp nhất'],
            calculable: true
        },
        toolbox: {
            show: true,
            //orient: 'vertical',
            left: 'left',
            top: 'top',
            feature: {
                restore: {
                    onclick: function () {

                    }
                },
                saveAsImage: {}
            }
        },
        series: [
            {
                name: 'Số lượng',
                type: 'map',
                roam: true,
                map: 'VN',
                emphasis: {
                    label: {
                        show: true
                    }
                },
                data: chartData
            }
        ],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    };

    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"685px"}
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
            padding: "16px 16px 30px"
        }}>
            <ReactECharts
                option={option}
                style={{ height: "650px", width: "100%" }}
            />
        </Box>

    );
}

export default MapChart;