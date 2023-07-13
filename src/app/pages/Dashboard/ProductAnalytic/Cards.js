import { Box, Card, Grid, Icon, IconButton, Skeleton, Tooltip, useTheme } from '@mui/material';
import { Paragraph } from '../../../components/Typography';
import React from 'react';
import { convertToVND } from '../../../utils/utils';

const Cards = ({ data }) => {
    const { palette } = useTheme();
    if (!data) {
        return (
            <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
                {
                    [1, 2, 3, 4].map((_, idx) => (
                        <Grid item lg={3} md={3} sm={6} xs={12} key={idx}>

                            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                                <Skeleton
                                    variant="rounded" width={"100%"}
                                    height={"120px"}
                                />
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    const cardList = [
        { name: 'Đã bán', amount: data.prodSold, icon: 'sell', tooltip: "Số lượng đã bán" },
        { name: 'Bán được', amount: convertToVND(data.prodRevenue), icon: 'attach_money', tooltip: "Thu được từ sản phẩm" },
        { name: 'Chờ xử lý', amount: data.pendProd, icon: 'hourglass_top', tooltip: "Số lượng chờ xử lý" },
        { name: 'Bị hủy', amount: data.cancProd, icon: 'cancel', tooltip: "Số lượng bị hủy" },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
            {cardList.map((item, index) => (
                <Grid item lg={3} md={3} sm={6} xs={12} key={index}>
                    <Box sx={{
                        backgroundColor: palette.background.paper,
                        color: palette.text.primary,
                        "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "borderRadius": "8px", "padding": "20px", "display": "flex", "WebkitBoxAlign": "center", "alignItems": "center", "WebkitBoxPack": "center", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important"
                    }}>
                        <Tooltip title={item.tooltip}>
                            <IconButton sx={{
                                color: palette.action.disabled
                            }}>
                                <Icon>{item.icon}</Icon>
                            </IconButton>
                        </Tooltip>
                        <Box sx={{ marginLeft: "12px" }}>
                            <Paragraph sx={{
                                "marginBottom": "0px",
                                "fontWeight": "500",
                                "lineHeight": "1.5",
                                "textTransform": "none",
                                "marginTop": "4px",
                                "fontSize": "32px"
                            }}>{item.amount}</Paragraph>
                            <Paragraph sx={{
                                "fontSize": "14px",
                                "textTransform": "uppercase",
                                "margin": "0px",
                                "marginLeft": "2px",
                                "color": palette.text.secondary
                            }}>{item.name}</Paragraph>
                        </Box>
                    </Box>
                </Grid>
            ))}

        </Grid>
    );
};

export default Cards;
