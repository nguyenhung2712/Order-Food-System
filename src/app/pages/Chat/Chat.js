import { useState } from 'react';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Collapse } from '@mui/material';
import { Breadcrumb, SimpleCard } from "../../components";
import UserChatList from './UserChatList';
import ChatContent from './ChatContent';
import ChatHeader from './ChatHeader';
import { useTheme } from '@mui/system';

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const drawerBleeding = 56;

const Chat = () => {
    const theme = useTheme();
    const classes = useStyles();
    const [isOpenList, setOpenList] = useState(true);
    const toggleDrawer = () => {
        setOpenList(prev => !prev);
    };

    return (
        <Box sx={{ margin: "12px 20px", height: "100%", display: "flex", flexDirection: "column" }}>
            <Breadcrumb routeSegments={[{ name: "Chat" }]} />
            <SimpleCard
                sx={{ padding: 0, margin: "12px 0 16px", flexGrow: 1 }}

            >
                <Box sx={{ display: "flex", height: "100%" }}>
                    <Collapse orientation="horizontal" in={isOpenList} sx={{ minWidth: "auto !important" }}>
                        <Box ><UserChatList classes={classes} /></Box>
                    </Collapse>
                    <Box sx={{
                        flexGrow: 1,
                        backgroundColor: theme.palette.action.hover,
                        height: "100%"
                    }}>
                        <ChatHeader onToggleUserList={toggleDrawer} />
                        <ChatContent classes={classes} />
                    </Box>

                </Box>
            </SimpleCard>

        </Box>
    );
}

export default Chat;