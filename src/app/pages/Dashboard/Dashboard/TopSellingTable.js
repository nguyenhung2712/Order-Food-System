import {
    Avatar, Box, Card, Icon, IconButton, MenuItem, Select, styled,
    Table, TableBody, TableCell, TableHead, TableRow, useTheme, Skeleton
} from '@mui/material';
import { Paragraph } from '../../../components/Typography';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertToVND, getFirstAndLastDate } from '../../../utils/utils';

const CardHeader = styled(Box)(() => ({
    display: 'flex',
    paddingLeft: '24px',
    paddingRight: '24px',
    marginBottom: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
}));

const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
}));

const ProductTable = styled(Table)(() => ({
    minWidth: 400,
    whiteSpace: 'pre',
    '& small': {
        width: 50,
        height: 15,
        borderRadius: 500,
        boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
    },
    '& td': { borderBottom: 'none' },
    '& td:first-of-type': { paddingLeft: '16px !important' },
}));

const Small = styled('small')(({ bgcolor }) => ({
    width: 50,
    height: 15,
    color: '#fff',
    padding: '2px 8px',
    borderRadius: '4px',
    overflow: 'hidden',
    background: bgcolor,
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));

const TopSellingTable = ({ data }) => {
    const navigate = useNavigate();
    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;

    const [filterType, setFilterType] = useState("this_month");
    const [products, setProducts] = useState();

    useEffect(() => {
        if (data) {
            setProducts(
                data.map(product => {
                    return {
                        ...product,
                        revenue: product.revenueWithTime.reduce((acc, rev) => {
                            switch (filterType) {
                                case "last_month": {
                                    let { firstDate, lastDate } = getFirstAndLastDate(1);
                                    return acc + (
                                        new Date(rev.date).getTime() <= lastDate.getTime() &&
                                            new Date(rev.date).getTime() >= firstDate.getTime()
                                            ? rev.revenue
                                            : 0
                                    );
                                }
                                case "last_6_month": {
                                    let { firstDate, lastDate } = getFirstAndLastDate(6);
                                    return acc + (
                                        new Date(rev.date).getTime() <= lastDate.getTime() &&
                                            new Date(rev.date).getTime() >= firstDate.getTime()
                                            ? rev.revenue
                                            : 0
                                    );
                                }
                                case "last_year": {
                                    let { firstDate, lastDate } = getFirstAndLastDate(1, true);
                                    return acc + (
                                        new Date(rev.date).getTime() <= lastDate.getTime() &&
                                            new Date(rev.date).getTime() >= firstDate.getTime()
                                            ? rev.revenue
                                            : 0
                                    );
                                }
                                default: {
                                    let lastDate = new Date();
                                    let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                                    return acc + (
                                        new Date(rev.date).getTime() <= lastDate.getTime() &&
                                            new Date(rev.date).getTime() >= firstDate.getTime()
                                            ? rev.revenue
                                            : 0
                                    );
                                }
                            }
                        }, 0)
                    }
                })
                    .sort((a, b) => b.revenue - a.revenue)
                    .slice(0, 4)
            );
        }
    }, [data, filterType]);

    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }

    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <CardHeader>
                <Title>Bán chạy nhất</Title>
                <Select size="small" value={filterType} onChange={(e) => {
                    setFilterType(e.target.value)
                }}>
                    <MenuItem value="this_month">Tháng này</MenuItem>
                    <MenuItem value="last_month">Tháng trước</MenuItem>
                    <MenuItem value="last_6_month">6 Tháng trước</MenuItem>
                    <MenuItem value="last_year">Năm trước</MenuItem>
                </Select>
            </CardHeader>

            <Box overflow="auto">
                <ProductTable>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ px: 3 }} colSpan={4}>
                                Tên
                            </TableCell>
                            <TableCell sx={{ px: 0 }} colSpan={2}>
                                Doanh thu
                            </TableCell>
                            <TableCell sx={{ px: 0 }} colSpan={2}>
                                Tình trạng
                            </TableCell>
                            <TableCell sx={{ px: 0 }} colSpan={1}>
                                Chi tiết
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {products && products.map((product, index) => (
                            <TableRow key={index} hover>
                                <TableCell colSpan={4} align="left" sx={{ px: 0, textTransform: 'capitalize' }}>
                                    <Box display="flex" alignItems="center">
                                        <Avatar src={product.image.split("|").filter(image => image !== "")[0]} />
                                        <Paragraph sx={{ m: 0, ml: 4 }}>{product.dishName}</Paragraph>
                                    </Box>
                                </TableCell>

                                <TableCell align="left" colSpan={2} sx={{ px: 0, textTransform: 'capitalize' }}>
                                    {convertToVND(product.revenue)}

                                </TableCell>

                                <TableCell sx={{ px: 0 }} align="left" colSpan={2}>
                                    {
                                        product.status === 0
                                            ? <Small bgcolor={bgError}>Ngừng bán</Small>
                                            : <Small bgcolor={bgPrimary}>Sẵn sàng</Small>
                                    }
                                </TableCell>
                                <TableCell sx={{ px: 0 }} colSpan={1}>
                                    <IconButton onClick={() => navigate(`/product/${product.id}`)}>
                                        <Icon color="primary">arrow_forward</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </ProductTable>
            </Box>
        </Card>
    );
};

export default TopSellingTable;
