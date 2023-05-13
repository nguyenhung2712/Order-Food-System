import { Card } from '@mui/material';
import { Box, styled } from '@mui/system';
import React from 'react';

const CardRoot = styled(Card)(() => ({
    height: '100%',
    padding: '20px 24px',
}));

const CardTitle = styled('div')(({ subtitle }) => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
    marginBottom: !subtitle && '16px',
}));

const SimpleCard = ({ children, title, subtitle, icon, sx, sxTitle }) => {
    return (
        <CardRoot elevation={6} sx={{ ...sx }}>
            <CardTitle subtitle={subtitle} sx={{ ...sxTitle }}>{title}</CardTitle>

            {subtitle && <Box sx={{ mb: 2 }}>{subtitle}</Box>}
            {children}
        </CardRoot>
    );
};

export default SimpleCard;
