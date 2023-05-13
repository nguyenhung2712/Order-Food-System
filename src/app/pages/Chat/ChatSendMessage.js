import { useState, useEffect } from 'react';
import React from 'react';
import { Fab, Grid, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import useAuth from '../../hooks/useAuth';
import MessageService from '../../services/message.service';

const ChatSendMessage = ({ conver, render }) => {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [image, setImage] = useState("");

    useEffect(() => {

    }, []);

    /* const handleSend = async () => {
        await MessageService.createMessage({
            message,
            adminId: user.id,
            converId: conver.id
        })
            .then(res => {
                render(prev => !prev);
            });
    } */

    return (
        <Grid
            container
            sx={{
                display: "flex",
                alignItems: "center",
                margin: "0 8px"
            }}
        >
            <Grid item lg={11} md={11} sm={11} xs={11}>
                <TextField
                    id="outlined-basic-email"
                    label="Type Something"
                    defaultValue={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                />
            </Grid>
            <Grid item lg={1} md={1} sm={1} xs={1}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Fab
                    size="small"
                    color="primary"
                    aria-label="add"
                /* onClick={handleSend} */
                ><SendIcon /></Fab>
            </Grid>
        </Grid>
    )
}

export default ChatSendMessage;