import { Card, Fab, Grid, Icon, lighten, styled, useTheme, Box, Button } from '@mui/material';
import React from 'react';

import { H2, Span, Paragraph } from "../../../components/Typography";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { numberFormatter } from '../../../utils/utils';

const PeriodCard = ({ data }) => {
    const { palette } = useTheme();
    const textError = palette.error.main;
    const bgError = lighten(palette.error.main, 0.85);
    return (
        <Card elevation={3} sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
        }}>
            <Box sx={{
                marginBottom: "20px",
                textAlign: "center"
            }}>
                <Paragraph sx={{
                    fontSize: "0.6875rem",
                    color: "rgba(52, 49, 76, 0.54)"
                }}>
                    Số lượng báo cáo vi phạm
                </Paragraph>
                <H2 sx={{
                    fontSize: "28px"
                }}> {data.lastMonth} </H2>
            </Box>
            <Button sx={{
                borderRadius: "2.5rem",
                backgroundColor: (data.month - data.lastMonth < 0) ? bgError : "rgba(9,182,109,.17)",
                color: (data.month - data.lastMonth < 0) ? textError : "#08ad6c",
                width: "fit-content",
                padding: "0.3125rem 1.125rem",
                fontSize: "0.75rem",
                '&:hover': {
                    backgroundColor: (data.month - data.lastMonth < 0) ? textError : palette.success.main,
                    color: palette.common.white
                }
            }}>
                {
                    (data.month - data.lastMonth < 0)
                        ? <ArrowDropUpIcon />
                        : <ArrowDropDownIcon />
                }
                <Span>
                    {
                        (data.month - (data.lastMonth === 0 ? 1 : data.lastMonth)) * 100
                        / (data.lastMonth === 0 ? 1 : data.lastMonth)
                        + " %"
                    }
                </Span>
            </Button>
        </Card>
    )
}

export default PeriodCard