/* import { useState, useEffect } from "react"; */
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { LinearProgress } from "@mui/material";
import { Breadcrumb } from "../../components";
import DetailInfo from "./forms/DetailInfo";

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
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    return (
        <>
            {
                loading && <LinearProgress
                    sx={{ position: "absolute", width: "100%" }}
                    variant="determinate"
                    value={progress}
                />
            }
            <Container>
                <Box className="breadcrumb">
                    <Breadcrumb routeSegments={[{ name: "Quản lý món ăn", path: "/product/manage" }, { name: "Thông tin món ăn" }]} />
                </Box>

                <Stack spacing={3}>
                    <DetailInfo id={id}
                        onSetLoading={setLoading}
                        onSetProgress={setProgress}
                    />
                </Stack>
            </Container>
        </>
    );
};

export default ProductDetail;
