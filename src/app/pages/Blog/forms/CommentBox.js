import { useState, useEffect } from "react";
import React from 'react';
import {
    Avatar,
    Box, List, ListItem, ListItemAvatar, ListItemText, IconButton, ListItemSecondaryAction
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ReactPaginate from 'react-paginate';

import { H2, Paragraph, H3, H1, Span } from "../../../components/Typography";
import CommentService from "../../../services/comment.service";
import { getTimeDifference } from "../../../utils/utils";

const CommentBox = ({ comment }) => {
    return (
        <Box>
            <ListItem
                key={comment.id}
                alignItems="flex-start"
                sx={{
                    width: "fit-content"
                }}
            >
                <Box sx={{
                    display: "flex",
                    flexDirection: "column"
                }}>
                    <Box sx={{ display: "flex", gap: "6px" }}>
                        <ListItemAvatar>
                            <Avatar src={comment.user.avatar} />
                        </ListItemAvatar>
                        <ListItemText
                            sx={{
                                width: "fit-content",
                                flex: "none"
                            }}
                            primaryTypographyProps={{
                                backgroundColor: "rgb(240,242,245)",
                                borderRadius: "10px 10px 0 0",
                                padding: "8px 8px 0",
                                fontWeight: "bold"
                            }}
                            secondaryTypographyProps={{
                                backgroundColor: "rgb(240,242,245)",
                                borderRadius: "0 0 10px 10px",
                                padding: "8px",
                                fontWeight: 400,
                                color: "#5c5c5c",
                            }}
                            primary={comment.user.firstName + " " + comment.user.lastName}
                            secondary={comment.message && <Span>{comment.message}</Span>}
                        />
                    </Box>
                    {
                        comment.image &&
                        <img
                            style={{
                                borderRadius: '10px',
                                objectFit: "cover", width: "250px",
                            }}
                            src={comment.image}
                            alt="Product Image"
                        />
                    }
                </Box>
                <ListItemSecondaryAction
                    sx={{
                        top: "40px"
                    }}
                >
                    <IconButton
                        edge="end" aria-label="comments"
                    /* onClick={() => handleDeleteRating(rating.id)} */
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Paragraph
                sx={{
                    marginTop: "-8px",
                    paddingLeft: "80px",
                    fontSize: "14px"
                }}
            >{getTimeDifference(new Date(comment.createdAt))}</Paragraph>
        </Box>
    )
}

export default CommentBox;