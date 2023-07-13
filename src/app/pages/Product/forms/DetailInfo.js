import { useEffect, useState } from "react";
import React from 'react';
import { Grid, Tabs, Tab, Backdrop, CircularProgress } from "@mui/material";

import ProductService from "../../../services/product.service";
import RateService from "../../../services/rate.service";
import { TabPanel, a11yProps } from "../../../components/TabPanel";

import RatingInfo from "./RatingInfo";
import ProductInfo from "./ProductInfo";
import StatisticInfo from "./StatisticInfo";

const DetailInfo = ({ id, onSetProgress, onSetLoading }) => {

    const [tabValue, setTabValue] = useState(0);

    const [temp, setTemp] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [state, setState] = useState();
    const [statisticInfo, setStatisticInfo] = useState();
    const [ratings, setRatings] = useState();
    const [fiveRatings, setFiveRatings] = useState();
    const [fourRatings, setFourRatings] = useState();
    const [threeRatings, setThreeRatings] = useState();
    const [twoRatings, setTwoRatings] = useState();
    const [oneRatings, setOneRatings] = useState();

    const [ratingScore, setRatingScore] = useState(0);
    const [imageArr, setImageArr] = useState();

    useEffect(() => {
        onSetLoading(true);
        (async () => {
            await ProductService.getProductById(id, {
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    onSetProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            onSetLoading(false);
                        }, 600);
                    }
                },
            })
                .then(async (res) => {
                    let product = res.data.payload;
                    let productImage = product.image.split('|').filter(image => image !== '');
                    setImageArr(productImage);
                    let productIngres = product.ingredients.replaceAll(/[.]/g, "").split(", ");
                    product.ingredients = productIngres;
                    product.DishToppings = product.DishToppings.map(tpp => tpp.topping.tppName);
                    await ProductService.getStatisticInfo(id)
                        .then(res => {
                            setStatisticInfo(res.data.payload);
                        });
                    setState(product);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (state) {
                await RateService.getRatingById(state.id)
                    .then((res) => {
                        let ratings = res.data.payload;
                        if (ratings.length > 0) {
                            setRatingScore(round(ratings.reduce((acc, rating) => acc + Number(rating.score), 0) / ratings.length, 1));
                        }
                        setRatings(ratings);
                        setFiveRatings(ratings.filter(rating => Number(rating.score) === 5));
                        setFourRatings(ratings.filter(rating => Number(rating.score) === 4));
                        setThreeRatings(ratings.filter(rating => Number(rating.score) === 3));
                        setTwoRatings(ratings.filter(rating => Number(rating.score) === 2));
                        setOneRatings(ratings.filter(rating => Number(rating.score) === 1));
                    });
            }
        })();
    }, [state, temp]);


    const round = (value, precision) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    return (
        <>
            <Tabs
                value={tabValue}
                onChange={(event, newValue) => setTabValue(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs"
            >
                <Tab
                    {...a11yProps(0)}
                    label="Thông tin sản phẩm"
                />
                <Tab
                    {...a11yProps(1)}
                    label="Thông tin thống kê"
                />
            </Tabs>
            <TabPanel value={tabValue} index={0} style={{ height: "100%" }}>
                <Grid container spacing={2}>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <ProductInfo data={{ state, ratings, imageArr }} />
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <RatingInfo
                            ratings={ratings}
                            fiveRatings={fiveRatings}
                            fourRatings={fourRatings}
                            threeRatings={threeRatings}
                            twoRatings={twoRatings}
                            oneRatings={oneRatings}
                            setLoading={setLoading}
                            setTemp={setTemp}
                            ratingScore={ratingScore}
                        />
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={tabValue} index={1} style={{ height: "100%" }}>
                <Grid container spacing={0}>
                    <StatisticInfo data={statisticInfo} />
                </Grid>
            </TabPanel>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default DetailInfo;
