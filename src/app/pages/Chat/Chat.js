import { useState, useEffect } from 'react';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Typography, Divider, Grid, Paper } from '@mui/material';
import UserChatList from './UserChatList';
import ChatContent from './ChatContent';
import ChatSendMessage from './ChatSendMessage';
import ConverService from '../../services/conver.service';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const Chat = () => {
    const classes = useStyles();
    const [convers, setConvers] = useState([]);
    const [curConver, setCurConver] = useState();
    const [isRender, setRender] = useState(false);

    useEffect(() => {
        (async () => {
            await ConverService.getAllConvers()
                .then(res => {
                    let convers = res.data.payload;
                    setConvers(convers);
                    if (curConver) {
                        setCurConver(convers.filter(conver => conver.id === curConver.id)[0])
                    }
                });
        })()
    }, [isRender])

    return (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5" className="header-message">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <UserChatList
                    classes={classes}
                    setCurConver={setCurConver}
                    data={convers}
                />
                <Grid item xs={9}>
                    {/* <ChatContent
                        classes={classes}
                        data={curConver.Messages}
                    /> */}
                    <Divider />
                    <ChatSendMessage
                        render={setRender}
                        conver={curConver ? curConver : {}}
                    />
                </Grid>
            </Grid>
        </div>
    );
}

export default Chat;