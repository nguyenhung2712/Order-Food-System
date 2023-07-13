/* import { useState, useEffect } from "react"; */
import { useEffect, useState, useRef } from "react";
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Grid, TextField, IconButton, Button, Skeleton,
    Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem
} from "@mui/material";
import { Box, styled } from "@mui/system";

import { Breadcrumb, SimpleCard } from "../../components";
import UserInfo from "./forms/UserInfo";
import BlogInfo from "./forms/BlogInfo";
import BlogService from "../../services/blog.service";
import CommentInfo from "./forms/CommentInfo";
import { Paragraph } from "../../components/Typography";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { convertToDateTimeStr } from "../../utils/utils";

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
    const navigate = useNavigate();
    const anchorRef = useRef(null);
    const componentRef = useRef(null);

    const [state, setState] = useState();
    const [isFiltered, setFilter] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [filterType, setFilterType] = useState("newest");
    const [isOpenFilter, setOpenFilter] = useState(false);

    useEffect(() => {
        (async () => {
            await BlogService.getBlogById(id)
                .then(async (res) => {
                    let blog = res.data.payload;
                    setState(blog);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, []);

    const handleToggle = () => {
        setOpenFilter((prevOpen) => !prevOpen);
    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpenFilter(false);
        } else if (event.key === 'Escape') {
            setOpenFilter(false);
        }
    }

    const handleClose = (event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.targe)
        ) {
            return;
        }
        setOpenFilter(false);
    };

    const handleSetFilter = (event) => {
        const { value } = event.currentTarget.dataset;
        setFilterType(value);
        setOpenFilter(false);
    };

    return (
        <Container>
            <Box className="breadcrumb">
                <Breadcrumb routeSegments={[{ name: "Quản lý blog", path: "/blog/manage" }, { name: "Thông tin blog" }]} />
            </Box>
            <Grid container spacing={2}>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ justifyContent: "center" }}>
                    <SimpleCard
                        title="Thông tin Blog"
                        sxTitle={{ paddingLeft: "20px" }}
                        sx={{ paddingRight: 0, paddingLeft: 0, height: "fit-content", position: "relative" }}
                    >
                        <Box sx={{ position: "absolute", top: "24px", right: "24px" }}>
                            {
                                state
                                    ? <Paragraph sx={{ color: "rgba(52, 49, 76, 0.54)", fontSize: "14px" }}>
                                        {convertToDateTimeStr(state, "createdAt", true)}
                                    </Paragraph>
                                    : <Skeleton
                                        variant="text"
                                        height={"50px"}
                                    />
                            }

                        </Box>
                        <BlogInfo data={state} commentComponent={componentRef.current} />
                    </SimpleCard>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                    <SimpleCard
                        title="Thông tin người viết"
                        sxTitle={{ paddingLeft: "20px" }}
                        sx={{
                            paddingRight: 0,
                            paddingLeft: 0,
                            position: "relative",
                            paddingBottom: 0,
                            height: "fit-content !important"
                        }}
                    >
                        <UserInfo data={state} />
                        {
                            state &&
                            <Button
                                sx={{ position: "absolute", top: "12px", right: "12px" }}
                                onClick={() => navigate(`/customer/${state.user.id}`)}
                            >Chi tiết</Button>
                        }
                    </SimpleCard>

                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2, height: "fit-content !important" }} ref={componentRef}>
                    <SimpleCard
                        title="Thông tin bình luận"
                        sxTitle={{ paddingLeft: "20px" }}
                        sx={{
                            margin: "12px 0 0",
                            paddingRight: 0,
                            paddingLeft: 0,
                            position: "relative",
                            overflow: "visible !important"
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <TextField
                                id="outlined-basic"
                                label="Lọc bình luận..."
                                variant="outlined"
                                sx={{ width: "220px" }}
                                onChange={(event) => {
                                    setFilter(event.target.value !== "" ? true : false);
                                    setFilterText(event.target.value);
                                }}
                            />
                            <IconButton
                                ref={anchorRef}
                                id="composition-button"
                                aria-controls={isOpenFilter ? 'composition-menu' : undefined}
                                aria-expanded={isOpenFilter ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                                sx={{
                                    width: "50px",
                                    height: "50px"
                                }}
                            >
                                <FilterAltIcon />
                            </IconButton>
                            <Popper
                                open={isOpenFilter}
                                anchorEl={anchorRef.current}
                                role={undefined}
                                placement="bottom-start"
                                sx={{ zIndex: 500 }}
                                transition
                                disablePortal
                            >
                                {({ TransitionProps, placement }) => (
                                    <Grow
                                        {...TransitionProps}
                                        style={{
                                            transformOrigin:
                                                placement === 'bottom-start' ? 'left top' : 'left bottom',
                                        }}
                                    >
                                        <Paper>
                                            <ClickAwayListener onClickAway={handleClose}>
                                                <MenuList
                                                    autoFocusItem={isOpenFilter}
                                                    id="composition-menu"
                                                    aria-labelledby="composition-button"
                                                    onKeyDown={handleListKeyDown}
                                                >
                                                    <MenuItem data-value="oldest" onClick={handleSetFilter}>Cũ nhất</MenuItem>
                                                    <MenuItem data-value="newest" onClick={handleSetFilter}>Mới nhất</MenuItem>
                                                </MenuList>
                                            </ClickAwayListener>
                                        </Paper>
                                    </Grow>
                                )}
                            </Popper>
                        </Box>
                        <Box
                            sx={{
                                marginTop: "24px"
                            }}
                        >
                            <CommentInfo
                                isFiltered={isFiltered}
                                filterType={filterType}
                                filterText={filterText}
                                data={state}
                            />
                        </Box>
                    </SimpleCard>
                </Grid>
            </Grid>
        </Container >
    );
};

export default BlogDetail;
