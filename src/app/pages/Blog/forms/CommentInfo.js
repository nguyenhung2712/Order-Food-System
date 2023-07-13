import { useState, useEffect, useRef } from "react";
import React from 'react';
import { Box, List, Pagination, Skeleton } from "@mui/material";

import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import CommentService from "../../../services/comment.service";
import CommentBox from "./CommentBox";
import RepBox from "./RepBox";

const itemsPerPage = 5;

const CommentInfo = ({ data, isFiltered, filterText, filterType }) => {
    const repCommentRef = useRef([]);
    const [comments, setComments] = useState([]);
    const [filteredComment, setFilteredComment] = useState([]);
    const [isShowMore, setShowMore] = useState(false);

    const [page, setPage] = useState(1);

    useEffect(() => {
        (async () => {
            if (data) {
                await CommentService.getCommentByBlogId(data.id, "", "", filterType)
                    .then(res => {
                        let comments = res.data.results;
                        setComments(comments);
                        setFilteredComment(comments);
                    });
            }
        })()
    }, [data, filterType])

    useEffect(() => {
        (async () => {
            if (comments) {
                setFilteredComment(comments.filter(comment =>
                    comment.message.toLowerCase().indexOf(filterText) > -1
                    || (comment.user.firstName + " " + comment.user.lastName).toLowerCase().indexOf(filterText) > -1
                ));
            }
        })()
    }, [filterText]);

    if (!data || !comments) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "0 16px" }}>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    !isFiltered
                        ? comments
                            .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                            .map((comment, index) => (
                                <Box key={index}>
                                    <CommentBox comment={comment} />
                                    {
                                        comment.CommentReps.length > 0 &&
                                        <span
                                            style={{
                                                cursor: "pointer", marginLeft: "75px", fontSize: "14px",
                                                textDecoration: isShowMore ? "underline" : "none"
                                            }}
                                            onClick={function (event) {
                                                const repCommentRefClassList = repCommentRef.current[index].classList;
                                                if (repCommentRefClassList) {
                                                    repCommentRefClassList.remove("d-none");
                                                }
                                                event.target.classList.add("d-none");
                                            }}
                                            onMouseEnter={() => setShowMore(true)}
                                            onMouseLeave={() => setShowMore(false)}
                                        >
                                            <span className="text-xs pb-1 mb-1 last:mb-0 pl-10 hover:underline cursor-pointer">
                                                <SubdirectoryArrowRightIcon /> Xem tất cả
                                            </span>
                                        </span>
                                    }
                                    <Box
                                        sx={{
                                            marginLeft: "65px",
                                            marginTop: "-20px"
                                        }}
                                        ref={el => (repCommentRef.current[index] = el)}
                                        className="d-none"
                                    >
                                        {
                                            comment.CommentReps.map((rep, index) => (
                                                <RepBox key={index} rep={rep} />
                                            ))
                                        }
                                    </Box>
                                </Box>
                            ))
                        : filteredComment.map((comment, index) => (
                            <CommentBox key={index} comment={comment} />
                        ))
                }

            </List>
            <Box
                sx={{
                    marginTop: "16px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {
                    !isFiltered &&
                    <Pagination
                        count={Math.ceil(comments.length / itemsPerPage)}
                        page={page}
                        onChange={(event, val) => setPage(val)}
                        defaultPage={1}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                }
            </Box>
        </Box>
    );
};

export default CommentInfo;
