import React, { useState, useEffect } from 'react';
import { Box, Grid, LinearProgress, IconButton, Drawer } from "@mui/material";
import { styled } from "@mui/system";
import ProfileTab from "./forms/ProfileTab";
import BasicProfile from "./forms/BasicProfile";
import Password from "./forms/Password";
import Device from "./forms/Device";
import { H5 } from "../../components/Typography";
import AppsIcon from '@mui/icons-material/Apps';

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
}));


const Profile = () => {
    const [open, setOpen] = useState(false);
    const [tabValue, setTabValue] = useState(1);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setOpen(prev => !prev);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    }
    return (
        <>
            <Drawer
                anchor={"left"}
                open={open}
                onClose={() => setOpen(false)}
            >
                <ProfileTab
                    onClickTab={setTabValue}
                    value={tabValue}
                    isUsedCard={false}
                />
            </Drawer>
            <Container>
                {
                    windowWidth < 896 &&
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "12px"
                    }}>
                        <IconButton color="primary" onClick={() => setOpen(prev => !prev)}>
                            <AppsIcon />
                        </IconButton>
                        <H5 sx={{ fontSize: "14px" }}>Mở rộng</H5>
                    </Box>
                }
                <Grid container spacing={2}>
                    {
                        windowWidth >= 896 &&
                        <Grid item lg={3} md={4} sm={4} xs={12}>
                            <ProfileTab
                                onClickTab={setTabValue}
                                value={tabValue}
                                isUsedCard={true}
                            />

                        </Grid>
                    }
                    <Grid item
                        lg={windowWidth >= 896 ? 9 : 12}
                        md={windowWidth >= 896 ? 8 : 12}
                        sm={windowWidth >= 896 ? 8 : 12} xs={12}
                    >
                        {
                            tabValue === 1 &&
                            <BasicProfile />
                        }
                        {
                            tabValue === 2 &&
                            <Password />
                        }
                        {
                            tabValue === 3 &&
                            <Device />
                        }
                    </Grid>
                </Grid>
            </Container>
        </>
    )
}

export default Profile