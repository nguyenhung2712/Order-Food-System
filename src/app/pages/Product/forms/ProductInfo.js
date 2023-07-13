import { useEffect, useState } from "react";
import React from 'react';
import {
    Grid, Chip, Avatar, Box, Divider,
    Tabs, Tab, useTheme, Skeleton
} from "@mui/material";

import { SimpleCard } from "../../../components";
import { H2, H4, H1 } from "../../../components/Typography";
import { TabPanel, a11yProps } from "../../../components/TabPanel";
import { convertToVND } from "../../../utils/utils";
import StarIcon from '@mui/icons-material/Star';

const ProductInfo = ({ data }) => {
    const { palette } = useTheme();

    const [tabValue, setTabValue] = useState(0);
    const [state, setState] = useState({});
    const [ratingScore, setRatingScore] = useState(0);

    useEffect(() => {
        if (data.ratings && data.state && data.imageArr) {
            setState(data.state);
            data.ratings.length > 0 && setRatingScore(
                round(data.ratings.reduce((acc, rating) =>
                    acc + Number(rating.score), 0) / data.ratings.length, 1
                ))
        }
    }, [data]);

    const round = (value, precision) => {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }

    if (!data.ratings || !data.state || !data.imageArr) {
        return (
            <SimpleCard title="Thông tin sản phẩm">
                <Grid container spacing={2}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ width: "100%", marginBottom: "12px" }}>
                            <Skeleton
                                variant="rounded" width={"100%"}
                                height={"450px"}
                            />
                        </Box>
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        <Box sx={{ width: "100%" }}>
                            <Skeleton variant="text" width="50%" height={50} />
                        </Box>
                        <Divider />
                        <Box sx={{ width: "100%", display: "flex" }}>
                            <Skeleton variant="text" width="15%" height={40} sx={{ marginRight: "12px" }} />
                            <Skeleton variant="text" width="15%" height={40} sx={{ marginRight: "12px" }} />
                            <Skeleton variant="text" width="15%" height={40} sx={{ marginRight: "12px" }} />
                        </Box>
                        <Divider />
                        <Box sx={{ width: "100%" }}>
                            <Skeleton variant="text" width="40%" height={50} />
                        </Box>
                        <Box sx={{ width: "100%" }}>
                            <Skeleton variant="text" width="40%" height={50} />
                        </Box>
                        <Divider />
                    </Grid>
                </Grid>
            </SimpleCard>
        );
    }

    return (

        <SimpleCard title="Thông tin sản phẩm">
            {
                state.type &&
                <Grid container spacing={4}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {
                            data.imageArr && data.imageArr.map((image, index) =>
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
                                    data.imageArr && data.imageArr.map((image, index) =>
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
                    <Grid item lg={6} md={6} sm={12} xs={12}>
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
                            {
                                Number(state.quantityLeft) === 0
                                    ? <Chip label="Hết hàng" color="error" size="small" sx={{ marginLeft: 2 }} />
                                    : Number(state.quantityLeft) < 30
                                        ? <Chip label={`Chỉ còn ${state.quantityLeft}`} color="warning" size="small" sx={{ marginLeft: 2 }} />
                                        : <Chip label={`Còn hàng (${state.quantityLeft})`} color="primary" size="small" sx={{ marginLeft: 2 }} />
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
                        <Box sx={{ display: "flex", position: "relative" }}>
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
                            <ul className="list" style={{
                                position: "absolute",
                                left: "300px"
                            }}>
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
                        <H2
                            sx={{
                                marginTop: 1,
                                marginBottom: 1
                            }}
                        >Thức ăn kèm</H2>
                        <Box sx={{ display: "flex", position: "relative" }}>
                            <ul className="list">
                                {
                                    state.DishToppings.slice(0, state.DishToppings.length / 2).map((topping, index) =>
                                        <li
                                            key={index}
                                            style={{
                                                textTransform: "capitalize",
                                                margin: 5
                                            }}
                                        >{topping}</li>
                                    )
                                }
                            </ul>
                            <ul className="list" style={{
                                position: "absolute",
                                left: "300px"
                            }}>
                                {
                                    state.DishToppings.slice(state.DishToppings.length / 2 + 1, state.DishToppings.length).map((topping, index) =>
                                        <li
                                            key={index}
                                            style={{
                                                textTransform: "capitalize",
                                                margin: 5
                                            }}
                                        >{topping}</li>
                                    )
                                }
                            </ul>
                        </Box>
                    </Grid>
                </Grid>
            }
        </SimpleCard>
    );
};

export default ProductInfo;
