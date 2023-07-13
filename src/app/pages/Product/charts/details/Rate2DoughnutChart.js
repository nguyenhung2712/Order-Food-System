import { useTheme } from '@mui/system'
import { Select, MenuItem, styled, Box } from '@mui/material'
import ReactEcharts from 'echarts-for-react'
import { convertToVND, getFirstAndLastDate } from '../../../../utils/utils';
import React, { useEffect, useState } from 'react';

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '.5rem',
    textTransform: 'capitalize',
}));

const Rate2DoughnutChart = ({ height, color = [], data }) => {
    const theme = useTheme()
    const [rate, setRate] = useState([]);
    const [filterType, setFilterType] = useState("this_month");
    useEffect(() => {
        let rates = data.Rates;
        let rateQuantity = [5, 4, 3, 2, 1].map(score => {
            return {
                value: rates.filter(rate => {
                    switch (filterType) {
                        case "last_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return (
                                Number(rate.score) === score &&
                                new Date(rate.createdAt).getTime() >= firstDate.getTime()
                                && new Date(rate.createdAt).getTime() <= lastDate.getTime()
                            );
                        }
                        case "last_6_month": {
                            let { firstDate, lastDate } = getFirstAndLastDate(6);
                            return (
                                Number(rate.score) === score &&
                                new Date(rate.createdAt).getTime() >= firstDate.getTime()
                                && new Date(rate.createdAt).getTime() <= lastDate.getTime()
                            );
                        }
                        case "last_year": {
                            let { firstDate, lastDate } = getFirstAndLastDate(1, true);

                            return (
                                Number(rate.score) === score &&
                                new Date(rate.createdAt).getTime() >= firstDate.getTime()
                                && new Date(rate.createdAt).getTime() <= lastDate.getTime()
                            )
                        }
                        default: {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);

                            return (
                                Number(rate.score) === score &&
                                new Date(rate.createdAt).getTime() >= firstDate.getTime()
                                && new Date(rate.createdAt).getTime() <= lastDate.getTime()
                            )
                        }
                    }
                }).length,
                name: `${score} sao`
            }
        });
        setRate(rateQuantity);
    }, [data, filterType]);
    const option = {
        legend: {
            show: true,
            itemGap: 20,
            type: 'scroll',
            orient: 'horizontal',
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
                        },
                        formatter: function (params) {
                            return params.name + ' \n' + params.value + ' (' + params.percent + '%)';
                        }
                    },

                },
                labelLine: {
                    normal: {
                        show: false,
                    },
                },
                data: rate,
            },
        ],
        textStyle: {
            fontFamily: `"Roboto","Helvetica","Arial",sans-serif`
        }
    }

    return (
        <>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between"
            }}>
                <Title>Tỉ lệ đánh giá</Title>
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
                option={{ ...option, }}
            />
        </>
    )
}

export default Rate2DoughnutChart;
