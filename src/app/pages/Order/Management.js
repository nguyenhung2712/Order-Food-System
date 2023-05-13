import { useNavigate } from 'react-router-dom';
import { Box, styled, Button } from "@mui/material";
import { Breadcrumb, SimpleCard } from "../../components";
import Table from "./Table";
import React from 'react';

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const Management = () => {

    const navigate = useNavigate();

    return (
        <Container>
            <Box className="breadcrumb" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb routeSegments={[{ name: "Quản lý" }]} />
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ my: 2 }}
                    onClick={() => navigate("/order/add")}
                >
                    Thêm mới
                </Button>
            </Box>

            <SimpleCard title="Quản lý đơn hàng">
                <Table />
            </SimpleCard>
        </Container>
    );
};

export default Management;