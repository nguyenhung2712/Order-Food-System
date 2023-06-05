import { Card, Grid, styled, useTheme, Box } from '@mui/material';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import LineChart from './LineChart';
import Cards from './Cards';
import DoughnutChart from './DoughnutChart';
import TopSellingTable from './TopSellingTable';
import RowCards from './RowCards';
import AnalyticService from '../../../services/analytic.service';
import { convertToDateTimeStr } from '../../../utils/utils';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '-80px 30px 30px',
    /* [theme.breakpoints.down('sm')]: { margin: '16px' }, */
}));

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginRight: '.5rem',
    textTransform: 'capitalize',
}));

const SubTitle = styled('span')(({ theme }) => ({
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
}));

const H4 = styled('h4')(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '16px',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
}));

const Analytics = () => {
    const [monthsRevenue, setMonthsRevenue] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [typesRevenue, setTypesRevenue] = useState([]);
    const [highestProduct, setHighestProduct] = useState([]);
    const [products, setProducts] = useState([]);
    const [recentSchedule, setRecentSchedule] = useState([]);

    const { palette } = useTheme();
    useEffect(() => {
        const curDate = new Date();
        (async () => {
            await AnalyticService.getDbAnalytics()
                .then(res => {
                    const data = res.data.payload;
                    setMonthsRevenue(data.revenueOf12Month);
                    setTotalUsers(data.newUsers);
                    setWeekRevenue(data.weekRevenue);
                    setTypesRevenue(data.types);
                    setTypesRevenue(data.types);
                    setProducts(data.products.map(product => {
                        let { OrderDetails, ...remains } = product;
                        return {
                            ...remains,
                            revenue: OrderDetails.reduce((acc, detail) => {
                                return acc + (
                                    detail.order.status === 1
                                        ? Number(detail.price) * detail.quantity
                                        : 0
                                );
                            }, 0),
                            revenueWithTime: OrderDetails.map(detail => {
                                return detail.order.status === 1
                                    ? {
                                        date: detail.order.updatedAt,
                                        revenue: Number(detail.price) * detail.quantity
                                    }
                                    : null
                            }),
                        }
                    }));
                    setRecentSchedule(
                        data.schedules.filter(schedule => {
                            let startDate = new Date(schedule.start);
                            return startDate.getTime() - curDate.getTime() <= 7 * 24 * 60 * 60 * 1000
                        }).slice(0, 4)
                    );
                });
        })()
    }, []);

    return (
        <Fragment>
            <Box sx={{ width: "100%", padding: "28px 32px 60px", backgroundColor: palette.primary.main }}>
                <LineChart
                    title="Doanh thu qua 12 tháng"
                    titleColor={palette.background.paper}
                    subColor={"#bcc4cd"}
                    color={"#fff"}
                    data={monthsRevenue}
                />
            </Box>
            <ContentBox className="analytics">
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={12} xs={12}>
                        <Cards data={{
                            totalUsers,
                            weekRevenue
                        }} />
                        <TopSellingTable data={products} />
                        <H4>Lịch trình sắp tới</H4>
                        <RowCards data={recentSchedule} />
                    </Grid>

                    <Grid item lg={4} md={4} sm={12} xs={12}>
                        <Card sx={{ px: 3, py: 2, mb: 3 }}>
                            <DoughnutChart
                                data={typesRevenue}
                                height="300px"
                                color={[palette.primary.dark, palette.primary.main, palette.primary.light]}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment >
    );
};

export default Analytics;
