import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { Grid, Tab, Tabs, Fade } from "@mui/material";
import { Box, styled } from "@mui/system";

import { Breadcrumb, SimpleCard } from "../../components";
import StaffInfo from "./forms/StaffInfo";
import RoleInfo from "./forms/RoleInfo";
import LogInfo from "./forms/LogInfo";
import ActionsForm from "./forms/ActionsForm";

import StaffService from "../../services/staff.service";
import RoleService from "../../services/role.service";
import PermissService from "../../services/permiss.service";
import TrackerService from "../../services/tracker.service";

import { TabPanel, a11yProps } from "../../components/TabPanel";

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
    const [logs, setLogs] = useState([]);
    const [value, setValue] = useState(0);
    const [render, setRender] = useState(false);

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
            await StaffService.getStaffById(id)
                .then((res) => {
                    let staff = res.data.payload;
                    setState({...staff, 
                        lastLogin: new Date(staff.lastLogin), 
                        createdAt: new Date(staff.createdAt), 
                        updatedAt: new Date(staff.updatedAt),
                        deletedAt: new Date(staff.deletedAt) ? new Date(staff.deletedAt) : null,
                        disabledAt: new Date(staff.disabledAt) ? new Date(staff.disabledAt) : null,
                    });
                    TrackerService.getByAdminId(staff.id)
                        .then(res => {
                            let logs = res.data.payload;
                            logs = logs.map(log => ({
                                apiText: log.apiText,
                                ipAddress: log.ipAddress,
                                createdAt: new Date(log.createdAt),
                                typeApi: log.typeApi,
                                statusCode: log.statusCode
                            }));
                            setLogs(logs);
                        })
                })
        })()
    }, [render]);

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản lý", path: "/staff/manage" }, { name: "Thông tin" }]} />
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={value} 
                    onChange={handleChange} 
                    aria-label="basic tabs example"
                >
                    <Tab label="Thông tin" {...a11yProps(0)} />
                    <Tab label="Logs" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                
                <Grid container spacing={2}>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, height: "fit-content" }} component="div">
                        <SimpleCard
                            title="Thông tin nhân viên"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0 }}
                        >
                            {
                                state &&
                                    <StaffInfo 
                                        data={ state }
                                    />
                            }
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, height: "fit-content"  }}>
                        <SimpleCard 
                            title="Thông tin quyền"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0 }}    
                        >
                            {
                                roles && roles.length !== 0 && permiss && permiss.length !== 0 &&
                                    <RoleInfo 
                                        permiss={ permiss }
                                        roles={ roles }
                                    />
                            }
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, height: "fit-content"  }}>
                        <SimpleCard 
                            title="Các tác vụ khác"
                            sxTitle={{ paddingLeft: "20px" }}
                            sx={{ paddingRight: 0, paddingLeft: 0 }}    
                        >
                            {
                                state &&
                                    <ActionsForm
                                        data={ state }
                                        setRender={ setRender }
                                    />
                            }
                        </SimpleCard>
                    </Grid>
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SimpleCard title="Thông tin lịch sử truy cập" >
                    {
                        logs && logs.length !==0 &&
                            <LogInfo 
                                data={ logs }
                            />
                    }
                </SimpleCard>
            </TabPanel>
            
        </Container>
    );
};

export default StaffDetail;
