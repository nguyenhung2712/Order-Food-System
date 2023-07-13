import { Box, Card, Grid, Icon, IconButton, styled, Tooltip, Skeleton } from '@mui/material';
import { Small } from '../../../components/Typography';
import React from 'react';
import { convertToVND } from '../../../utils/utils';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '24px !important',
    background: theme.palette.background.paper,
    [theme.breakpoints.down('sm')]: { padding: '16px !important' },
}));

const ContentBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    '& small': { color: theme.palette.text.secondary },
    '& .icon': { opacity: 0.6, fontSize: '44px', color: theme.palette.primary.main },
}));

const Heading = styled('h6')(({ theme }) => ({
    margin: 0,
    marginTop: '4px',
    fontSize: '14px',
    fontWeight: '500',
    color: theme.palette.primary.main,
}));

const Cards = ({ data }) => {
    const cardList = [
        { name: 'Khách hàng mới (tuần này)', amount: data.totalUsers, icon: 'group' },
        { name: 'Doanh thu (tuần này)', amount: convertToVND(data.weekRevenue), icon: 'attach_money' },
        /* { name: 'Tình trạng cửa hàng', amount: '8.5% Stock Surplus', icon: 'store' },
        { name: 'Đơn hàng đang giao', amount: '305 Đơn', icon: 'shopping_cart' }, */
    ];

    if ((!data.totalUsers || !data.weekRevenue) && data.totalUsers !== 0 && data.weekRevenue !== 0) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"100px"}
                />
            </Box>
        );
    }

    return (
        <Grid container spacing={3} sx={{ mb: '24px' }}>
            {cardList.map((item, index) => (
                <Grid item xs={6} md={6} key={index}>
                    <StyledCard elevation={6}>
                        <ContentBox>
                            <Icon className="icon">{item.icon}</Icon>
                            <Box ml="12px">
                                <Small>{item.name}</Small>
                                <Heading>{item.amount}</Heading>
                            </Box>
                        </ContentBox>

                        {/* <Tooltip title="View Details" placement="top">
                            <IconButton>
                                <Icon>arrow_right_alt</Icon>
                            </IconButton>
                        </Tooltip> */}
                    </StyledCard>
                </Grid>
            ))}
        </Grid>
    );
};

export default Cards;
