import { useTheme } from '@mui/system'
import { Select, MenuItem, styled, Box, Card, Skeleton } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { convertToVND, getFirstAndLastDate } from '../../../utils/utils';
import React, { useEffect, useState } from 'react';

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '.5rem',
    textTransform: 'capitalize',
}));

const RegionDoughnutChart = ({ height, color = [], data, regionData }) => {
    const theme = useTheme()
    const [regionRevenue, setRegionsRevenue] = useState([]);
    const [filterType, setFilterType] = useState("this_month");
    useEffect(() => {
        if (data) {
            let temp = regionData.map(region => ({
                name: region.regionName,
                value: data.reduce((acc, detail) => {
                    let defCondition = detail.order.status === 1 &&
                        detail.order.address.province.region.regionName === region.regionName;
                    switch (filterType) {
                        case "last_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return acc + (
                                defCondition &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                    ? Number(detail.price) * detail.quantity
                                    : 0
                            );
                        }
                        case "last_6_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(6);
                            return acc + (
                                defCondition &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                    ? Number(detail.price) * detail.quantity
                                    : 0
                            );
                        }
                        case "last_year": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1, true);
                            return acc + (
                                defCondition &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                    ? Number(detail.price) * detail.quantity
                                    : 0
                            );
                        }
                        default: {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return acc + (
                                defCondition &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                    ? Number(detail.price) * detail.quantity
                                    : 0
                            );
                        }
                    }
                }, 0)
            }));
            setRegionsRevenue(temp);
        }
    }, [data, regionData, filterType]);
    const option = {
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            show: true,
            itemGap: 20,
            icon: 'circle',
            bottom: 0,
            textStyle: {
                color: theme.palette.text.secondary,
                fontSize: 13,
            },
        },
        tooltip: {
            show: false,
            trigger: 'item',
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
                    borderWidth: 2,
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
                        },
                        formatter: function (params) {
                            return params.name + ' \n' + convertToVND(params.value) + ' (' + params.percent + '%)';
                        }
                    },

                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                data: regionRevenue,
            },
        ],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    }
    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"350px"}
                />
            </Box>
        );
    }
    return (
        <>
            <Card sx={{ px: 3, py: 2 }}>

                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between"
                }}>
                    <Title>Doanh thu theo vùng</Title>
                    <Select size="small" value={filterType} onChange={(e) => {
                        setFilterType(e.target.value)
                    }}>
                        <MenuItem value="this_month">Tháng này</MenuItem>
                        <MenuItem value="last_month">Tháng trước</MenuItem>
                        <MenuItem value="last_6_month">6 Tháng trước</MenuItem>
                        <MenuItem value="last_year">Năm trước</MenuItem>
                    </Select>
                </Box>

                <ReactEcharts
                    style={{ height: height, width: "100%" }}
                    option={{
                        ...option,
                    }}
                />
            </Card>
        </>
    )
}

export default RegionDoughnutChart;
