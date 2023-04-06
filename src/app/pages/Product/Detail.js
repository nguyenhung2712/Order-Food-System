/* import { useState, useEffect } from "react"; */
import { useParams } from 'react-router-dom';

import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { Breadcrumb, SimpleCard } from "../../components";
import ProductInfo from "./forms/ProductInfo";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const ProductDetail = () => {
    const { id } = useParams();
    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản lý", path: "/product/manage" }, { name: "Thông tin" }]} />
            </Box>

            <Stack spacing={3}>
                <SimpleCard title="Thông tin sản phẩm">
                    <ProductInfo
                        id={id}
                    />
                </SimpleCard>
            </Stack>
        </Container>
    );
};

export default ProductDetail;
