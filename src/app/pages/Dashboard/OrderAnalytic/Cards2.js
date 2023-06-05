import { Box, Card, Grid, Icon, IconButton, styled, Tooltip, useTheme } from '@mui/material';
import { Paragraph, Span, H4 } from '../../../components/Typography';
import React from 'react';
import { convertToVND } from '../../../utils/utils';

const Cards = ({ data }) => {
    const { palette } = useTheme();
    const cardList = [
        { name: 'Đang bán', amount: data.quantityLeft },
        { name: 'Đã bán', amount: data.sold }
    ];
    return (
        <Box sx={{ "height": "80%", "display": "flex", "flexDirection": "column" }}>
            {cardList.map((item, index) => (
                <Box key={index} sx={{
                    backgroundColor: palette.background.paper,
                    color: palette.text.primary,
                    height: "100%",
                    "transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "borderRadius": "8px", "display": "flex", "padding": "20px", "WebkitBoxAlign": "center", "alignItems": "center", "WebkitBoxPack": "justify", "justifyContent": "space-between", "marginBottom": "16px", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important"
                }}>
                    <Span sx={{
                        "fontSize": "14px",
                        "textTransform": "uppercase",
                        "margin": "0px"
                    }}>{item.name}</Span>
                    <H4 sx={{ "marginBottom": "0px", "marginTop": "0px", "fontSize": "16px", "fontWeight": "500", "lineHeight": "1.5", "textTransform": "none" }}>{item.amount}</H4>
                </Box>
            ))}
        </Box>
    );
};

export default Cards;
