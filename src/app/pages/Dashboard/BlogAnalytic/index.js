import { Card, Grid, styled, useTheme, Box } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import React from 'react';
import MostBlogs from './MostBlogs';
import Cards from './Cards';
import LineChart from './LineChart';
import HeatMap from './HeatMap';
import AnalyticService from '../../../services/analytic.service';
import { getFirstAndLastDate } from '../../../utils/utils';

const ContentBox = styled('div')(({ theme }) => ({
    margin: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const dayOfWeeks = [0, 1, 2, 3, 4, 5, 6];
const hours = [
    0, 1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17,
    18, 19, 20, 21, 22, 23
];

const BlogAnalytics = () => {
    const { palette } = useTheme();
    const [blogs, setBlogs] = useState();
    const [interactsCard, setInteractsCard] = useState();
    const [interactsChart, setInteractsChart] = useState();
    const placeholderImage = `/assets/images/viet-blog-3.jpg`;
    useEffect(() => {
        (async () => {
            await AnalyticService.getBlogAnalytics()
                .then(res => {
                    let blogs = res.data.payload.blogs.map(blog => ({
                        ...blog,
                        image: getImageUrl(blog.content) || placeholderImage,
                        commentsTotal: blog.Comments.map(comment => {
                            return comment.CommentReps.length + 1;
                        }).reduce((acc, total) => acc + total, 0),
                        likesTotal: blog.Interacts.filter(interact => interact.type === 1).length,
                        reportsTotal: blog.Interacts.filter(interact => interact.type === 2).length,
                        monthLikes: blog.Interacts.filter(interact => {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return interact.type === 1 &&
                                (
                                    (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                    (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                                )
                        }).length,
                        lastMonthLikes: blog.Interacts.filter(interact => {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return interact.type === 1 &&
                                (
                                    (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                    (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                                )
                        }).length,
                        monthReports: blog.Interacts.filter(interact => {
                            let lastDate = new Date();
                            let firstDate = new Date(lastDate.getFullYear(), lastDate.getMonth(), 1);
                            return interact.type === 2 &&
                                (
                                    (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                    (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                                )
                        }).length,
                        lastMonthReports: blog.Interacts.filter(interact => {
                            let { firstDate, lastDate } = getFirstAndLastDate(1);
                            return interact.type === 2 &&
                                (
                                    (new Date(interact.createdAt)).getTime() >= firstDate.getTime() &&
                                    (new Date(interact.createdAt)).getTime() <= lastDate.getTime()
                                )
                        }).length,
                    }));
                    setBlogs(
                        blogs
                            .sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
                            .slice(0, 4)
                    );
                    setInteractsCard({
                        likesTotal: blogs.reduce((acc, blog) => acc + blog.likesTotal, 0),
                        reportsTotal: blogs.reduce((acc, blog) => acc + blog.reportsTotal, 0),
                        avgLikesTotal: blogs.reduce((acc, blog) => acc + blog.likesTotal, 0) / blogs.length,
                        avgReportsTotal: blogs.reduce((acc, blog) => acc + blog.reportsTotal, 0) / blogs.length,

                        monthLikes: blogs.reduce((acc, blog) => acc + blog.monthLikes, 0),
                        lastMonthLikes: blogs.reduce((acc, blog) => acc + blog.lastMonthLikes, 0),

                        avgMonthLikes: blogs.reduce((acc, blog) => acc + blog.monthLikes, 0) / blogs.length,
                        avgLastMonthLikes: blogs.reduce((acc, blog) => acc + blog.lastMonthLikes, 0) / blogs.length,

                        avgMonthReports: blogs.reduce((acc, blog) => acc + blog.monthReports, 0) / blogs.length,
                        avgLastMonthReports: blogs.reduce((acc, blog) => acc + blog.lastMonthReports, 0) / blogs.length,

                        monthReports: blogs.reduce((acc, blog) => acc + blog.monthReports, 0),
                        lastMonthReports: blogs.reduce((acc, blog) => acc + blog.lastMonthReports, 0),
                    });
                    let cmts = blogs
                        .map(blog => {
                            return blog.Comments;
                        }).flat();
                    let repCmts = blogs
                        .map(blog => {
                            return blog.Comments.map(comment => {
                                return comment.CommentReps
                            });
                        }).flat(2);
                    let totalCmts = cmts.concat(repCmts);
                    let likes = blogs.map(blog => blog.Interacts.filter(interact => interact.type === 1)).flat();
                    setInteractsChart({
                        comments: dayOfWeeks.map(day => totalCmts.filter(cmt => {
                            return (new Date(cmt.createdAt)).getDay() === day
                        }).length),
                        avgComments: dayOfWeeks.map(day => Number((totalCmts.filter(cmt => {
                            return (new Date(cmt.createdAt)).getDay() === day
                        }).length / totalCmts.length).toFixed(2))),
                        likes: dayOfWeeks.map(day => (likes.filter(interact => {
                            return (new Date(interact.createdAt)).getDay() === day
                        }).length)),
                        avgLikes: dayOfWeeks.map(day => Number((likes.filter(interact => {
                            return (new Date(interact.createdAt)).getDay() === day
                        }).length / likes.length).toFixed(2))),
                        heatmap: dayOfWeeks.map(day =>
                            hours.map(hour => {
                                let t = blogs.filter(blog =>
                                    (new Date(blog.createdAt).getHours() === hour) &&
                                    (new Date(blog.createdAt).getDay() === day)
                                ).length
                                return [hour, day, t]
                            })
                        ).flat()
                    });
                })
        })()
    }, []);
    function getImageUrl(str) {
        let urlRegex = /(https?:\/\/[^\s]+)/g;
        let arrayRes = [];
        str.replace(urlRegex, function (url) {
            arrayRes.push(url.slice(0, url.length - 1));
        });
        return arrayRes[0];
    }
    return (
        <Fragment>
            <ContentBox className="analytics">
                <MostBlogs data={blogs} />
                {
                    interactsCard &&
                    <Cards data={interactsCard} />
                }
                <Grid container spacing={3}>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {
                            interactsChart &&
                            <LineChart
                                data={{
                                    data: interactsChart.comments,
                                    avgData: interactsChart.avgComments
                                }}
                                title={"Số lượng bình luận"}
                                mainTitle={"Bình luận"}
                                subTitle={"Trung bình bình luận trong ngày"}
                                mainColor={"#FF5A70"}
                            />
                        }
                    </Grid>
                    <Grid item lg={6} md={6} sm={12} xs={12}>
                        {
                            interactsChart &&
                            <LineChart
                                data={{
                                    data: interactsChart.likes,
                                    avgData: interactsChart.avgLikes
                                }}
                                title={"Số lượng lượt thích"}
                                mainTitle={"Lượt thích"}
                                subTitle={"Trung bình lượt thích trong ngày"}
                                mainColor={"#2DB982"}
                            />
                        }
                    </Grid>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        {
                            interactsChart &&
                            <HeatMap
                                data={{
                                    heatmap: interactsChart.heatmap
                                }}
                            />
                        }

                    </Grid>
                </Grid>
            </ContentBox>
        </Fragment >
    );
};

export default BlogAnalytics;
