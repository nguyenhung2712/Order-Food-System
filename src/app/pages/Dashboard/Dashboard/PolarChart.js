import { Select, MenuItem, styled, Box, Skeleton, Card } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { numberFormatter, getFirstAndLastDate } from '../../../utils/utils';
import React, { useEffect, useState } from 'react';

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '.5rem',
    textTransform: 'capitalize',
}));
const PolarChart = ({ height, data }) => {
    const [typesRevenue, setTypesRevenue] = useState([]);
    const [filterType, setFilterType] = useState("this_month");

    useEffect(() => {
        if (data) {
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
        }
    }, [data, filterType]);

    const option = {
        polar: {
            radius: [30, '80%']
        },
        angleAxis: {
            max: 1.2 * Math.max(...typesRevenue.map(type => type.value)),
            startAngle: 75,
            axisLabel: {
                formatter: function (value) {
                    return numberFormatter(value) + " đ"
                }
            }
        },
        radiusAxis: {
            type: 'category'
        },
        tooltip: {},
        series: [
            {
                coordinateSystem: 'polar',
                name: 'Doanh thu',
                type: 'bar',

                /* label: {
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

                }, */
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
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
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
                    option={{ ...option }}
                />
            </Card>
        </>
    )
}

export default PolarChart;
