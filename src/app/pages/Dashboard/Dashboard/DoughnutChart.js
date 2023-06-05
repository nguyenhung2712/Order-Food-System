import { useTheme } from '@mui/system'
import { Select, MenuItem, styled, Box } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { convertToVND, getFirstAndLastDate } from '../../../utils/utils';
import React, { useEffect, useState } from 'react';

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '.5rem',
    textTransform: 'capitalize',
}));

/* setTypesRevenue(
    data.types.map(type => {
        return {
            name: type.typeName,
            value: type.Dishes.reduce((acc, dish) => {
                return acc + dish.OrderDetails.reduce((acc, detail) => {
                    return acc + Number(detail.price) * detail.quantity
                }, 0)
            }, 0)
        }
    })
); */
const DoughnutChart = ({ height, color = [], data }) => {
    const theme = useTheme()
    const [typesRevenue, setTypesRevenue] = useState([]);
    const [filterType, setFilterType] = useState("this_month");
    useEffect(() => {
        setTypesRevenue(
            data.map(type => {
                return {
                    name: type.typeName,
                    value: type.Dishes.reduce((acc1, dish) => acc1 + dish.OrderDetails.reduce((acc2, detail) => {
                        switch (filterType) {
                            case "last_month": {
                                let { firstDate, lastDate } = getFirstAndLastDate(1);
                                return (
                                    detail.order.status === 1 &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                )
                                    ? acc2 + Number(detail.price) * detail.quantity
                                    : 0;
                            }
                            case "last_6_month": {
                                let { firstDate, lastDate } = getFirstAndLastDate(6);

                                return (
                                    detail.order.status === 1 &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                )
                                    ? acc2 + Number(detail.price) * detail.quantity
                                    : 0;
                            }
                            case "last_year": {
                                let { firstDate, lastDate } = getFirstAndLastDate(1, true);

                                return (
                                    detail.order.status === 1 &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                )
                                    ? acc2 + Number(detail.price) * detail.quantity
                                    : 0;
                            }
                            default: {
                                let lastDate = new Date();
                                let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

                                return (
                                    detail.order.status === 1 &&
                                    new Date(detail.order.updatedAt).getTime() >= firstDate.getTime()
                                    && new Date(detail.order.updatedAt).getTime() <= lastDate.getTime()
                                )
                                    ? acc2 + Number(detail.price) * detail.quantity
                                    : 0;
                            }
                        }
                    }, 0), 0)
                }
            })
        );
    }, [data, filterType]);
    const option = {
        legend: {
            show: true,
            itemGap: 20,
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
                        position: 'center', // shows the description data to center, turn off to show in right side
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
                data: typesRevenue,
                /* itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }, */
            },
        ],
    }

    return (
        <>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Title>Doanh thu theo loại</Title>
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
                    color: [...color],
                }}
            />
        </>
    )
}

export default DoughnutChart;
