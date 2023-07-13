import { LinearProgress, Grid, styled } from '@mui/material';
import React, { useEffect, useState, Fragment } from 'react';
import AnalyticService from '../../../services/analytic.service';
import LocationService from '../../../services/location.service';
import BarChart from "./BarChart";
import MapChart from "./MapChart";
import LineChart from "./LineChart";
import TopSellingTable from "./TopSellingTable";
import TypeDoughnutChart from "./TypeDoughnutChart";
import RegionDoughnutChart from "./RegionDoughnutChart";
import Cards from "./Cards";
import { H3 } from '../../../components/Typography';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px 30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const ProductAnalytics = () => {

    const [products, setProducts] = useState();
    const [details, setDetails] = useState();
    const [types, setTypes] = useState();
    const [provinces, setProvinces] = useState([]);
    const [regions, setRegions] = useState([]);
    const [cardsValue, setCardsValue] = useState();

    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        (async () => {
            await AnalyticService.getProductAnalytics({
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    setProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 600);
                    }
                },
            })
                .then(res => {
                    let { types, products, details, } = res.data.payload;
                    setTypes(types);
                    setDetails(details);
                    setCardsValue({
                        prodSold: details.reduce((acc, detail) => {
                            return acc + (
                                [1, 2].includes(detail.order.status)
                                    ? detail.quantity
                                    : 0
                            );
                        }, 0),
                        prodRevenue: details.reduce((acc, detail) => {
                            return acc + (
                                [1, 2].includes(detail.order.status)
                                    ? Number(detail.price) * detail.quantity
                                    : 0
                            );
                        }, 0),
                        pendProd: details.reduce((acc, detail) => {
                            return acc + (
                                [3].includes(detail.order.status)
                                    ? detail.quantity
                                    : 0
                            );
                        }, 0),
                        cancProd: details.reduce((acc, detail) => {
                            return acc + (
                                [0].includes(detail.order.status)
                                    ? detail.quantity
                                    : 0
                            );
                        }, 0)
                    });

                    setProducts(products.map(product => {
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
            await LocationService.getAllProvinces()
                .then(res => {
                    setProvinces(res.data.payload);
                });
            await LocationService.getAllRegions()
                .then(res => {
                    setRegions(res.data.payload);
                });
        })()
    }, []);

    return (
        <Fragment>
            {
                loading &&
                <LinearProgress
                    sx={{ position: "absolute", width: "100%" }}
                    variant="determinate"
                    value={progress}
                />
            }
            <ContentBox className="">
                <H3 sx={{
                    fontSize: "18px",
                    fontWeight: "500",
                    marginBottom: "16px"
                }}>Tổng quan</H3>
                <Cards data={cardsValue} />
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <BarChart data={types} />
                    </Grid>

                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <MapChart provinceData={provinces} data={details} />
                    </Grid>
                    <Grid item lg={8} md={12} sm={12} xs={12}>
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <TypeDoughnutChart
                                    height="300px"
                                    data={types}
                                />
                            </Grid>
                            <Grid item lg={6} md={6} sm={6} xs={12}>
                                <RegionDoughnutChart
                                    height="300px"
                                    data={details}
                                    regionData={regions}
                                />
                            </Grid>
                            <Grid item lg={12} md={12} sm={12} xs={12}>
                                <TopSellingTable data={products} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <LineChart data={details} />
                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment >
    );
};

export default ProductAnalytics;
