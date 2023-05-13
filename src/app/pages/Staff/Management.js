import { useState, useEffect } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, styled, Button, Grid } from "@mui/material";

import { Breadcrumb, SimpleCard } from "../../components";
import EmployeeTable from "./EmployeeTable";
import RegisteredTable from "./RegisteredTable";

import StaffService from "../../services/staff.service";
import { init } from "../../redux/actions/StaffActions";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const Management = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rows, setRows] = useState([]);
    const [newStaffs, setNewStaffs] = useState([]);
    const [render, setRender] = useState(false);

    useEffect(() => {
        (async () => {
            await StaffService.getAllStaffs()
                .then((res) => {
                    let staffs = res.data.payload;
                    let rows = staffs.map(staff => ({
                        id: staff.id,
                        username: staff.username,
                        fullname: staff.fullname,
                        status: staff.status,
                        isActived: staff.isActived,
                        createdAt: new Date(staff.createdAt),
                        updatedAt: new Date(staff.updatedAt),
                        deletedAt: new Date(staff.deletedAt),
                        lastLogin: new Date(staff.lastLogin),
                        disabledAt: new Date(staff.disabledAt),
                        email: staff.email
                    }));
                    let approveStaff = rows.filter(row => row.isActived === 1);
                    let unApproveStaff = rows.filter(row => row.isActived === 0);
                    setRows(approveStaff);
                    setNewStaffs(unApproveStaff);
                    dispatch(init(staffs));
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, [render]);

    return (
        <Container>
            <Box className="breadcrumb" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumb routeSegments={[{ name: "Quản lý" }]} />
                <Button
                    variant="contained"
                    component="label"
                    color="primary"
                    sx={{ my: 2 }}
                    onClick={() => navigate("/staff/add")}
                >
                    Thêm mới
                </Button>
            </Box>
            <Grid container spacing={4}>
                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard
                        title="Quản lý nhân viên"
                    >
                        <EmployeeTable
                            rows={rows}
                            setRender={setRender}
                        />
                    </SimpleCard>
                </Grid>
                <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard title="Quản lý nhân viên đăng ký">
                        <RegisteredTable
                            rows={newStaffs}
                            setRender={setRender}
                        />
                    </SimpleCard>
                </Grid>

            </Grid>

        </Container>
    );
};

export default Management;