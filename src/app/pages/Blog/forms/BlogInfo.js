import { Box, Divider, Skeleton } from "@mui/material";
import parse from 'html-react-parser';
import React from 'react';

import { H1, Paragraph } from "../../../components/Typography";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MessageIcon from '@mui/icons-material/Message';

const BlogInfo = ({ data, commentComponent }) => {

    if (!data) {
        return (
            <Box>
                <Divider />
                <Skeleton
                    variant="text" width={"100%"}
                />
                <Box sx={{ display: "flex", gap: "16px", padding: "0 0 12px 24px", alignItems: "center" }}>
                    <Skeleton
                        variant="text" width={"30%"}
                    />

                </Box>
                <Divider />
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }

    return (
        <Box>
            <Divider />
            <H1 sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: "16px 24px 12px"
            }}
            >{data.header}</H1>
            <Box sx={{ display: "flex", gap: "16px", padding: "0 0 12px 24px", alignItems: "center" }}>
                <Paragraph>
                    <RemoveRedEyeIcon /> {data.Interacts.filter(interact => interact.type === 3).length}
                </Paragraph>
                <Paragraph>
                    <ThumbUpIcon /> {data.Interacts.filter(interact => interact.type === 1).length}
                </Paragraph>
                <Paragraph
                    onClick={() => commentComponent.scrollIntoView({ behavior: "smooth" })}
                    sx={{ cursor: 'pointer' }}
                >
                    <MessageIcon /> {
                        data.Comments.reduce((acc, comment) => {
                            return acc + 1 + comment.CommentReps.length
                        }, 0)
                    }
                </Paragraph>
            </Box>
            <Divider />

            <Box
                sx={{ padding: "12px 24px" }}
            > {parse(`${data.content}`)}
            </Box>
        </Box>
    );
};

export default BlogInfo;
