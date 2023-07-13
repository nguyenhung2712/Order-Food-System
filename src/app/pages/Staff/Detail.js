import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import React from 'react';

import { Grid, LinearProgress } from "@mui/material";
import { Box, styled } from "@mui/system";

import { Breadcrumb, SimpleCard } from "../../components";
import StaffInfo from "./forms/StaffInfo";
import RoleInfo from "./forms/RoleInfo";
import ActionsForm from "./forms/ActionsForm";

import StaffService from "../../services/staff.service";
import RoleService from "../../services/role.service";
import PermissService from "../../services/permiss.service";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const StaffDetail = () => {
    const { id } = useParams();
    const [state, setState] = useState({});
    const [roles, setRoles] = useState([]);
    const [permiss, setPermiss] = useState([]);
    const [value, setValue] = useState(0);
    const [render, setRender] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        console.log(1);
        (async () => {
            await RoleService.getRolesByAdminId(id)
                .then((res) => {
                    let roles = res.data.payload;

                    setRoles(roles);
                    PermissService.getPermissByRoleId(roles[0].id)
                        .then((res) => {
                            setPermiss(res.data.payload);
                        })
                });
            await StaffService.getStaffById(id, {
                onDownloadProgress: function (progressEvent) {
                    const percentage = (progressEvent.loaded / progressEvent.total) * 100;
                    setProgress(percentage)
                    if (percentage === 100) {
                        setTimeout(() => {
                            setLoading(false);
                        }, 600);
                    }
                },
            })
                .then((res) => {
                    let staff = res.data.payload;
                    setState(staff);
                })
        })()
    }, [render]);
    console.log(roles)
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
                    <Breadcrumb routeSegments={[{ name: "Quản lý", path: "/staff/manage" }, { name: "Thông tin" }]} />
                </Box>

                <Grid container spacing={2}>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }} component="div">
                        <SimpleCard
                            title="Thông tin nhân viên"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}
                        >
                            <StaffInfo data={state} />
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }}>
                        <SimpleCard
                            title="Thông tin quyền"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}
                        >
                            {
                                permiss && roles &&
                                <RoleInfo
                                    permiss={permiss}
                                    roles={roles}
                                />
                            }
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ height: "fit-content" }}>
                        <SimpleCard
                            title="Các tác vụ khác"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0, paddingBottom: 0 }}
                        >
                            <ActionsForm
                                data={state}
                                setRender={setRender}
                            />
                        </SimpleCard>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default StaffDetail;
