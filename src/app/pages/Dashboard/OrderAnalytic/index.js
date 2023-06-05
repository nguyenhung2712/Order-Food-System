import { Grid, styled, useTheme, Box } from '@mui/material';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import Cards from './Cards';
import Cards2 from './Cards2';
import PurchaseOrder from './PurchaseOrder';
import TopSellingTable from './TopSellingTable';
import LineChart from './LineChart';
import AnalyticService from '../../../services/analytic.service';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const H4 = styled('h4')(({ theme }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '16px',
    textTransform: 'capitalize',
    color: theme.palette.text.secondary,
}));


const OrderAnalytics = () => {

    const { palette } = useTheme();
    const [products, setProducts] = useState([]);
    const [cardData1, setCardData1] = useState();
    const [cardData2, setCardData2] = useState();
    const [stockData, setStockData] = useState();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const curDate = new Date();
        (async () => {
            await AnalyticService.getDbAnalytics()
                .then(res => {
                    const data = res.data.payload;
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
                });
            await AnalyticService.getOrderAnalytics()
                .then(res => {
                    let { cardData, stockData, orders } = res.data.payload;
                    let { quantityLeft, sold, ...remains } = cardData;
                    setCardData1(remains);
                    setCardData2({ quantityLeft, sold });
                    setStockData({ stockData, orders })
                    setOrders(orders);
                });
        })()
    }, []);

    return (
        <Fragment>
            <ContentBox className="">
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} sm={8} xs={12}>
                        <H4>Hoạt động bán hàng</H4>
                        {cardData1 && <Cards data={cardData1} />}
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>
                        <H4>Hoạt động bán hàng trong ngày</H4>
                        {cardData2 && <Cards2 data={cardData2} />}
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {stockData && <PurchaseOrder data={stockData} />}
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <TopSellingTable data={products} />
                    </Grid>
                </Grid>
                {
                    orders &&
                    <LineChart
                        /* title="Doanh thu qua 12 tháng"
                        titleColor={palette.background.paper} */
                        subColor={"#bcc4cd"}
                        color={"#fff"}
                        data={orders}
                    />
                }

            </ContentBox>
        </Fragment >
    );
};

export default OrderAnalytics;
