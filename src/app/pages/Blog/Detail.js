/* import { useState, useEffect } from "react"; */
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { Grid } from "@mui/material";
import { Box, styled } from "@mui/system";

import { Breadcrumb, SimpleCard } from "../../components";
import UserInfo from "./forms/UserInfo";
import BlogInfo from "./forms/BlogInfo";
import BlogService from "../../services/blog.service";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const BlogDetail = () => {
    const { id } = useParams();
    const [state, setState] = useState({});

    useEffect(() => {
        (async () => {
            await BlogService.getBlogById(id)
                .then((res) => {
                    let blog = res.data.payload;
                    setState(blog);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, []);

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản lý", path: "/blog/manage" }, { name: "Thông tin" }]} />
            </Box>
            <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard
                        title="Thông tin người viết"
                        sxTitle={{ paddingLeft: "20px" }}
                        sx={{ paddingRight: 0, paddingLeft: 0 }}
                    >
                        <UserInfo
                            data={ state.user }
                        />
                    </SimpleCard>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2 }}>
                    <SimpleCard 
                        title="Thông tin Blog"
                        sxTitle={{ paddingLeft: "20px" }}
                        sx={{ paddingRight: 0, paddingLeft: 0 }}    
                    >
                        <BlogInfo
                            data={state}
                        />
                    </SimpleCard>
                </Grid>
            </Grid>
        </Container>
    );
};

export default BlogDetail;
