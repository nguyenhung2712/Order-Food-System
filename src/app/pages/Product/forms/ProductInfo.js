import { useEffect, useState, useRef } from "react";
import React from 'react';
import {
    Grid,
    Chip, Pagination, Avatar,
    Box, Divider,
    Tabs, Tab, useTheme,
    ListItem, ListItemText, ListItemAvatar, IconButton, Backdrop, CircularProgress
} from "@mui/material";

import ProductService from "../../../services/product.service";
import RateService from "../../../services/rate.service";

import { H2, H4, H1, Span } from "../../../components/Typography";
import { TabPanel, a11yProps } from "../../../components/TabPanel";
import { convertToVND } from "../../../utils/utils";
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import swal from "sweetalert";
import RatingInfo from "./RatingInfo";

const itemsPerPage = 4;

const ProductInfo = ({ id }) => {
    const { palette } = useTheme();
    console.log(palette);
    const [temp, setTemp] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [state, setState] = useState({});
    const [ratings, setRatings] = useState([]);
    const [fiveRatings, setFiveRatings] = useState([]);
    const [fourRatings, setFourRatings] = useState([]);
    const [threeRatings, setThreeRatings] = useState([]);
    const [twoRatings, setTwoRatings] = useState([]);
    const [oneRatings, setOneRatings] = useState([]);

    const [ratingScore, setRatingScore] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [imageArr, setImageArr] = useState([]);

    useEffect(() => {
        (async () => {
            await ProductService.getProductById(id)
                .then(async (res) => {
                    let product = res.data.payload;
                    let productImage = product.image.split('|').filter(image => image !== '');
                    if (imageArr.length === 0) {
                        productImage.forEach(image => {
                            setImageArr(curr => [...curr, image]);
                        })
                    }
                    let productIngres = product.ingredients.replaceAll(/[.]/g, "").split(", ");
                    product.ingredients = productIngres;
                    setState(product);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, []);

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
            <Box>
                {
                    state.type &&
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2, }}>
                            {
                                imageArr && imageArr.map((image, index) =>
                                    <TabPanel value={tabValue} index={index} key={index} >
                                        <Box sx={{
                                            display: 'flex', justifyContent: 'center'
                                        }}>
                                            <img
                                                style={{
                                                    border: '3px solid', borderRadius: '10px',
                                                    borderColor: palette.primary.main,
                                                    height: '340px', width: '80%',
                                                }}
                                                src={image}
                                                alt="Product Image"
                                            />
                                        </Box>

                                    </TabPanel>
                                )
                            }
                            <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                                <Tabs
                                    value={tabValue}
                                    onChange={(event, newValue) => setTabValue(newValue)}
                                    sx={{
                                        '.MuiTabs-indicator': {
                                            top: 0,
                                        },
                                    }}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label="scrollable auto tabs"
                                >
                                    {
                                        imageArr && imageArr.map((image, index) =>
                                            <Tab
                                                key={index}
                                                sx={{ width: 200 }}
                                                {...a11yProps(index)}
                                                icon={
                                                    <Avatar
                                                        alt="test avatar"
                                                        src={image}
                                                        sx={{
                                                            border: 5,
                                                            height: 150,
                                                            width: '100%'
                                                        }}
                                                    />
                                                }
                                            />
                                        )
                                    }
                                </Tabs>
                            </Box>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <H1
                                textTransform="capitalize"
                                sx={{
                                    marginBottom: 1
                                }}
                            >{state.dishName}</H1>
                            <Divider />
                            <H4
                                sx={{
                                    margin: "12px 0"
                                }}
                            >
                                <Chip label={state.type.typeName} color="primary" size="small" sx={{ marginLeft: 2 }} />
                                {
                                    state.status === 2
                                        ? <Chip label="Tạm ẩn" color="error" size="small" sx={{ marginLeft: 2 }} />
                                        : state.status === 0
                                            ? <Chip label="Tạm xóa" size="small" sx={{ marginLeft: 2 }} />
                                            : state.status === 1 && Number(state.quantityLeft) > 0
                                                ? <Chip label="Có sẵn" color="primary" size="small" sx={{ marginLeft: 2 }} />
                                                : <Chip label="Hết hàng" color="error" size="small" sx={{ marginLeft: 2 }} />
                                }
                            </H4>
                            <Divider />
                            <H4
                                sx={{
                                    marginTop: 1,
                                    marginBottom: 1,
                                    fontSize: "30px",
                                    fontWeight: "600"
                                }}
                            >{convertToVND(state.price)}</H4>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                marginTop: 1,
                                marginBottom: 1,
                            }}>
                                <span
                                    style={{
                                        marginRight: "4px",
                                        fontSize: "16px",
                                        color: "orange"
                                    }}
                                >{ratingScore}</span>
                                {[...Array(5)].map((_, idx) => {
                                    let widthPercent;
                                    if (idx + 1 >= ratingScore) {
                                        if (ratingScore - idx > 0) {
                                            widthPercent = ((round(ratingScore - idx, 2) + 0.08) * 100).toString() + "%";
                                        } else {
                                            widthPercent = "0%";
                                        }
                                    }

                                    return (
                                        <Box
                                            sx={{
                                                position: 'relative'
                                            }} key={idx}
                                        >
                                            <Box
                                                sx={{
                                                    width: idx + 1 < ratingScore ? "100%" : widthPercent,
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    zIndex: 50,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                <StarIcon sx={{ color: "orange" }} />
                                            </Box>
                                            <StarIcon sx={{ color: "gray" }} />
                                        </Box>
                                    )
                                })}
                            </Box>

                            <Divider />
                            <H2
                                sx={{
                                    marginTop: 1,
                                    marginBottom: 1
                                }}
                            >Nguyên liệu</H2>
                            <Box sx={{
                                display: "flex",
                                justifyContent: "space-around"
                            }}>
                                <ul className="list">
                                    {
                                        state.ingredients.slice(0, state.ingredients.length / 2).map((ingre, index) =>
                                            <li
                                                key={index}
                                                style={{
                                                    textTransform: "capitalize",
                                                    margin: 5
                                                }}
                                            >{ingre}</li>
                                        )
                                    }
                                </ul>
                                <ul className="list">
                                    {
                                        state.ingredients.slice(state.ingredients.length / 2 + 1, state.ingredients.length).map((ingre, index) =>
                                            <li
                                                key={index}
                                                style={{
                                                    textTransform: "capitalize",
                                                    margin: 5
                                                }}
                                            >{ingre}</li>
                                        )
                                    }
                                </ul>
                            </Box>
                        </Grid>
                    </Grid>
                }
            </Box>
            <Divider />
            <Box
                sx={{
                    padding: "8px 0"
                }}
            >
                <H4>Thông tin đánh giá</H4>
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
            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
};

export default ProductInfo;
