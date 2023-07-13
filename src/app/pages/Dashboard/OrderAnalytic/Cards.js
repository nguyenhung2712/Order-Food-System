import { Box, Grid, Icon, IconButton, Skeleton, Tooltip, useTheme } from '@mui/material';
import { Paragraph } from '../../../components/Typography';
import React from 'react';

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
                                    height={"150px"}
                                />
                            </Box>
                        </Grid>
                    ))
                }
            </Grid>
        );
    }
    const cardList = [
        { name: 'Được đóng gói', amount: data.packaged, icon: 'card_giftcard' },
        { name: 'Được vận chuyển', amount: data.shipping, icon: 'local_shipping' },
        { name: 'Đã giao hàng', amount: data.delivered, icon: 'assignment_turned_in' },
        { name: 'Được lập hóa đơn', amount: data.billed, icon: 'assignment' },
    ];

    return (
        <Grid container spacing={3} sx={{ mb: '24px', height: "80%" }}>
            {cardList.map((item, index) => (
                <Grid item lg={3} md={3} sm={6} xs={12} key={index}>
                    <Box sx={{
                        backgroundColor: palette.background.paper,
                        color: palette.text.primary,
                        "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "borderRadius": "8px", "padding": "20px", "display": "flex", "WebkitBoxAlign": "center", "alignItems": "center", "flexDirection": "column", "WebkitBoxPack": "center", "justifyContent": "center", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important"
                    }}>
                        <IconButton sx={{
                            color: palette.action.disabled
                        }}>
                            <Icon>{item.icon}</Icon>
                        </IconButton>
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
                            "color": palette.text.secondary
                        }}>{item.name}</Paragraph>
                    </Box>
                </Grid>
            ))}

        </Grid>
    );
};

export default Cards;
