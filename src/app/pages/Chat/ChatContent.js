import { useRef, useEffect, useState } from 'react';
import React from 'react';
import { List, ListItem, Grid, ListItemText, ListItemIcon, Avatar, IconButton, Box } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ChatContent = ({ data, classes }) => {
    const contentRef = useRef();
    /* const [messages, setMessages] = useState([]); */

    useEffect(() => {
        /* contentRef.current?.scrollIntoView({ behavior: "smooth" }); */
        console.log(data);
    }, [data]);

    return (
        <List className={classes.messageArea}>
            {/* {
                data &&
                data.map((message, index) => (
                    <ListItem key={index}>
                        {
                            message.adminId &&
                            <Grid container>
                                <Grid item xs={12}>
                                    <Box>
                                        <ListItemIcon>
                                            <IconButton edge="end" aria-label="comments">
                                                <MoreHorizIcon />
                                            </IconButton>
                                        </ListItemIcon>
                                        <ListItemText
                                            align="right"
                                            primary={message.message}
                                            primaryTypographyProps={{
                                                backgroundColor: "rgb(240,242,245)",
                                                padding: "12px",
                                                width: "fit-content",
                                                borderRadius: "4px"
                                            }}
                                        />
                                    </Box>

                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText
                                        align="right"
                                        secondary="09:30"
                                    ></ListItemText>
                                </Grid>
                            </Grid>
                        }
                        {
                            message.userId &&
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItem
                                        disablePadding
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="comments">
                                                <MoreHorizIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemIcon>
                                            <Avatar alt={message.user.lastName} src={message.user.avatar} />
                                        </ListItemIcon>
                                        <ListItemText
                                            align="left"
                                            primary={message.message}
                                            primaryTypographyProps={{
                                                backgroundColor: "rgb(240,242,245)",
                                                padding: "12px",
                                                display: "inline-block",
                                                borderRadius: "4px",
                                                margin: "0 !important"
                                            }}
                                        ></ListItemText>
                                    </ListItem>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="left" secondary="09:31"></ListItemText>
                                </Grid>
                            </Grid>
                        }
                    </ListItem>
                ))
            } */}
            <ListItem ref={contentRef} />
        </List>
    )
}

export default ChatContent