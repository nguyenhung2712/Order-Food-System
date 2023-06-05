import { Card, Grid, styled, useTheme, Box } from '@mui/material';
import { Fragment } from 'react';
import React, { useEffect, useState } from 'react';
import AnalyticService from '../../../services/analytic.service';
import LocationService from '../../../services/location.service';
import BarChart from "./BarChart";
import MapChart from "./MapChart";

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px 30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
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

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const ProductAnalytics = () => {

    const { palette } = useTheme();
    const [products, setProducts] = useState([]);
    const [temp, setTemp] = useState([]);
    useEffect(() => {
        const curDate = new Date();
        (async () => {
            /*  await AnalyticService.getDbAnalytics()
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
                 }); */
            await LocationService.getAllProvinces()
                .then(res => {
                    setTemp(res.data.payload.map((province, index) => {
                        let provinceName = province.provinceName;
                        if (Number(province.id) === 46) {
                            provinceName = "Thừa Thiên - Huế";
                        }
                        if (Number(province.id) === 79) {
                            provinceName = "Hồ Chí Minh city";
                        }
                        return {
                            name: provinceName,
                            value: index * 100000
                        }
                    }))
                })
        })()
    }, []);

    return (
        <Fragment>
            <ContentBox className="">



                <Grid container spacing={3}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <BarChart
                            months={months}
                        />
                    </Grid>

                    <Grid item lg={6} md={6} sm={6} xs={12}>
                        <MapChart data={temp} />
                    </Grid>
                    <Grid item lg={4} md={4} sm={4} xs={12}>

                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>

                    </Grid>
                    <Grid item lg={6} md={6} sm={6} xs={12}>

                    </Grid>

                </Grid>
            </ContentBox>
        </Fragment >
    );
};

export default ProductAnalytics;
