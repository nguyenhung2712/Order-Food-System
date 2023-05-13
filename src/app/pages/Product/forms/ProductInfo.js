import { useEffect, useState, useRef } from "react";
import React from 'react';
import {
    Grid,
    Chip, Pagination, Avatar,
    Box, Divider,
    Tabs, Tab,
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

const itemsPerPage = 4;

const ProductInfo = ({ id }) => {

    const [temp, setTemp] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [state, setState] = useState({});
    const [ratings, setRatings] = useState([]);
    const [page, setPage] = useState(1);
    const [fiveRatings, setFiveRatings] = useState([]);
    const [fivePage, setFivePage] = useState(1);
    const [fourRatings, setFourRatings] = useState([]);
    const [fourPage, setFourPage] = useState(1);
    const [threeRatings, setThreeRatings] = useState([]);
    const [threePage, setThreePage] = useState(1);
    const [twoRatings, setTwoRatings] = useState([]);
    const [twoPage, setTwoPage] = useState(1);
    const [oneRatings, setOneRatings] = useState([]);
    const [onePage, setOnePage] = useState(1);

    const [ratingScore, setRatingScore] = useState(0);
    const [tabValue, setTabValue] = useState(0);
    const [rateTabValue, setRateTabValue] = useState(0);
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
                            setRatingScore(round(ratings.reduce((acc, rating) => acc + Number(rating.score), 0) / ratings.length, 2));
                        }
                    });
                await RateService.getRatingById(state.id)
                    .then((res) => {
                        let ratings = res.data.payload;
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

    function handleDeleteRating(ratingId) {
        swal({
            title: "Xóa nội dung",
            text: "Đồng ý xóa nội dung này?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(async (result) => {
                if (result) {
                    setLoading(true);
                    await RateService.deleteRating(ratingId)
                        .then(res => {
                            setTemp(prev => !prev);
                            setLoading(false);
                        });
                } else {
                    /* setLoading(false); */
                }
            });

    }
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
                                    <TabPanel
                                        value={tabValue} index={index} key={index}
                                        style={{ display: 'flex', justifyContent: 'center' }}
                                    >
                                        <img
                                            style={{
                                                border: '5px solid #6a75c9', borderRadius: '10px',
                                                height: '340px', width: '80%',
                                            }}
                                            src={image}
                                            alt="Product Image"
                                        />
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
                                    marginTop: 1,
                                    marginBottom: 1
                                }}
                            >Loại: {state.type.typeName}</H4>
                            <H4
                                sx={{
                                    marginBottom: 1
                                }}
                            >
                                Tình trạng:
                                {
                                    state.status === 2
                                        ? <Chip label="Tạm ẩn" color="error" size="small" sx={{ marginLeft: 2 }} />
                                        : state.status === 0
                                            ? <Chip label="Tạm xóa" size="small" sx={{ marginLeft: 2 }} />
                                            : <Chip label="Có sẵn" color="primary" size="small" sx={{ marginLeft: 2 }} />
                                }
                            </H4>
                            <Divider />
                            <H4
                                sx={{
                                    marginTop: 1,
                                    marginBottom: 1
                                }}
                            >Giá bán: {convertToVND(state.price)}</H4>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center'
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
                                            widthPercent = (round(ratingScore - idx, 2) * 100).toString() + "%";
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
                            <ul className="list">
                                {
                                    state.ingredients.map((ingre, index) =>
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
                <Grid container spacing={6}>
                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2, }}>
                        <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={rateTabValue}
                                onChange={(event, newValue) => setRateTabValue(newValue)}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs"
                            >
                                <Tab
                                    {...a11yProps(10)}
                                    label="Tất cả"
                                />
                                <Tab
                                    {...a11yProps(11)}
                                    label="5 sao"
                                />
                                <Tab
                                    {...a11yProps(12)}
                                    label="4 sao"
                                />
                                <Tab
                                    {...a11yProps(13)}
                                    label="3 sao"
                                />
                                <Tab
                                    {...a11yProps(14)}
                                    label="2 sao"
                                />
                                <Tab
                                    {...a11yProps(15)}
                                    label="1 sao"
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={rateTabValue} index={0}>
                            {
                                ratings &&
                                ratings
                                    .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(ratings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setPage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={rateTabValue} index={1}>
                            {
                                fiveRatings &&
                                fiveRatings
                                    .slice((fivePage - 1) * itemsPerPage, fivePage * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(fiveRatings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setFivePage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={rateTabValue} index={2}>
                            {
                                fourRatings &&
                                fourRatings
                                    .slice((fourPage - 1) * itemsPerPage, fourPage * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(fourRatings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setFourPage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={rateTabValue} index={3}>
                            {
                                threeRatings &&
                                threeRatings
                                    .slice((threePage - 1) * itemsPerPage, threePage * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(threeRatings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setThreePage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={rateTabValue} index={4}>
                            {
                                twoRatings &&
                                twoRatings
                                    .slice((twoPage - 1) * itemsPerPage, twoPage * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(twoRatings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setTwoPage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                        <TabPanel value={rateTabValue} index={5}>
                            {
                                oneRatings &&
                                oneRatings
                                    .slice((onePage - 1) * itemsPerPage, onePage * itemsPerPage)
                                    .map(rating => (
                                        <ListItem
                                            key={rating.id}
                                            alignItems="flex-start"
                                            secondaryAction={
                                                <IconButton
                                                    edge="end" aria-label="comments"
                                                    onClick={() => handleDeleteRating(rating.id)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={rating.user.avatar} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={rating.user.firstName + " " + rating.user.lastName}
                                                secondary={
                                                    <>
                                                        <Span>{rating.remarks}</Span>
                                                        <Span sx={{
                                                            display: 'flex'
                                                        }}>
                                                            {[...Array(5)].map((_, idx) => (
                                                                <StarIcon
                                                                    key={idx}
                                                                    fontSize="small"
                                                                    sx={{
                                                                        color: idx < rating.score ? "orange" : "gray"
                                                                    }}
                                                                />
                                                            ))}
                                                        </Span>
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))
                            }
                            <Box sx={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
                                <Pagination
                                    count={Math.ceil(oneRatings.length / itemsPerPage)}
                                    page={page}
                                    onChange={(event, val) => setOnePage(val)}
                                    defaultPage={1}
                                    color="primary"
                                    showFirstButton
                                    showLastButton
                                />
                            </Box>
                        </TabPanel>
                    </Grid>
                </Grid>

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
