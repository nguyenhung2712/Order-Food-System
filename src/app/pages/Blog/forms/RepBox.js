import {
    Avatar,
    Box, ListItem, ListItemAvatar, ListItemText, IconButton, ListItemSecondaryAction
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';

import { Paragraph, Span } from "../../../components/Typography";
import { getTimeDifference } from "../../../utils/utils";

const RepBox = ({ rep }) => {
    return (
        <Box>
            <ListItem
                key={rep.id}
                alignItems="flex-start"
                sx={{
                    width: "fit-content"
                }}
            >
                <ListItemAvatar>
                    <Avatar src={rep.user.avatar} />
                </ListItemAvatar>
                <ListItemText
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
                    primary={rep.user.firstName + " " + rep.user.lastName}
                    secondary={
                        <>
                            {rep.message &&
                                <Paragraph>
                                    <Span sx={{ fontWeight: "bold" }}>{rep.user.firstName + " " + rep.user.lastName}</Span> {rep.message}
                                </Paragraph>}
                            {
                                rep.image &&
                                <img
                                    style={{
                                        borderRadius: '10px',
                                        objectFit: "cover", width: "300px",
                                    }}
                                    src={rep.image}
                                    alt="Image"
                                />
                            }
                        </>
                    }
                />
                <ListItemSecondaryAction
                    sx={{
                        top: "40px"
                    }}
                >
                    <IconButton
                        edge="end" aria-label="reps"
                    /* onClick={() => handleDeleteRating(rating.id)} */
                    >
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Paragraph
                sx={{
                    marginTop: "-15px",
                    paddingLeft: "80px",
                    fontSize: "14px"
                }}
            >{getTimeDifference(new Date(rep.createdAt))}</Paragraph>
        </Box>
    )
}

export default RepBox;