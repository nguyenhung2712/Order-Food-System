import { useRef, useEffect, useState } from 'react';
import React from 'react';
import {
    List, ListItem, Grid, ListItemText, ListItemIcon,
    Avatar, IconButton, Divider, Box, Tooltip,
    Dialog, DialogContent, Menu, MenuItem
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { AppContext } from '../../contexts/AppContext';
import useFirestore from '../../hooks/useFirestore';
import ChatSendMessage from './ChatSendMessage';
import { getTimeDifference, convertToDateTimeStr, toastify } from '../../utils/utils';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '@mui/system';
import { Paragraph } from "../../components/Typography";
import ChatIcon from '@mui/icons-material/Chat';
import { db } from '../../services/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

const ChatContent = ({ classes }) => {
    const contentRef = useRef();
    const theme = useTheme();
    const { selectedRoom } = React.useContext(AppContext);
    const { user: { id } } = useAuth();
    const [isOpenDialog, setOpenDialog] = useState(false);
    const [currentImage, setCurImage] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const handleClickMenu = (event, id) => {
        setSelectedMessageId(id);
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setSelectedMessageId(null);
        setAnchorEl(null);
    };

    const condition = React.useMemo(
        () => ({
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoom.id,
        }),
        [selectedRoom]
    );

    const messages = useFirestore('messages', condition);

    useEffect(() => {
        // scroll to bottom after message changed
        if (contentRef.current) {
            contentRef.current.scrollTop =
                contentRef.current.scrollHeight + 50;
        }
    }, [messages]);

    async function handleDeleteMessage(messageId) {
        const docRef = doc(db, "messages", messageId);

        await updateDoc(docRef, {
            status: 0,
        })
            .then(res => {
                toastify({
                    message: "Đã xóa tin nhắn",
                    type: "success",
                    position: "top-right"
                });
            });

    }

    return (
        <>
            {
                selectedRoom && Object.keys(selectedRoom).length !== 0
                    ? <>
                        <List className={classes.messageArea} ref={contentRef}>
                            {
                                messages &&
                                messages.map((message, index) => (
                                    <ListItem key={index}>
                                        {
                                            (message.adminId && message.createdAt) &&
                                            <Grid container>
                                                <Grid item xs={12} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                                                    {
                                                        message.adminId === id && message.status === 1 &&
                                                        <ListItemIcon>
                                                            <IconButton edge="end" aria-label="comments"
                                                                onClick={(e) => handleClickMenu(e, message.id)}
                                                            >
                                                                <MoreHorizIcon />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                    }
                                                    <Menu
                                                        id="long-menu"
                                                        MenuListProps={{
                                                            'aria-labelledby': 'long-button',
                                                        }}
                                                        anchorEl={anchorEl}
                                                        open={openMenu}
                                                        onClose={handleCloseMenu}
                                                        PaperProps={{
                                                            style: {
                                                                /* maxHeight: ITEM_HEIGHT * 4.5, */
                                                                width: '14ch',
                                                                boxShadow: '0px 0px 8px -3px rgba(66, 68, 90, 1)',
                                                            },
                                                        }}
                                                        sx={{
                                                            '& MuiList-root': {
                                                                padding: 0
                                                            }
                                                        }}
                                                    >
                                                        <MenuItem onClick={() => {
                                                            handleDeleteMessage(selectedMessageId)
                                                            handleCloseMenu();
                                                        }}>
                                                            Xóa
                                                        </MenuItem>
                                                    </Menu>
                                                    <Tooltip title={convertToDateTimeStr(message, "createdAt", true)}>
                                                        <Box sx={{ width: message.images ? "35%" : "fit-content", overFlow: "hidden" }}>
                                                            {
                                                                (message.text || message.images) &&
                                                                (
                                                                    message.status === 1
                                                                        ? <ListItemText
                                                                            sx={{ flex: "none" }}
                                                                            align="right"
                                                                            primary={message.text}
                                                                            primaryTypographyProps={{
                                                                                backgroundColor: theme.palette.primary.main,
                                                                                color: theme.palette.primary.contrastText,
                                                                                padding: "8px 16px",
                                                                                display: "inline-block",
                                                                                borderRadius: "4px",
                                                                                margin: "0 !important"
                                                                            }}
                                                                        ></ListItemText>
                                                                        : <ListItemText
                                                                            sx={{ flex: "none" }}
                                                                            align="right"
                                                                            primary={
                                                                                message.adminId === id
                                                                                    ? "Bạn đã xóa tin nhắn"
                                                                                    : "Người khác đã xóa tin nhắn"
                                                                            }
                                                                            primaryTypographyProps={{
                                                                                backgroundColor: theme.palette.action.hover,
                                                                                color: theme.palette.text,
                                                                                border: "1px solid",
                                                                                borderColor: theme.palette.text,
                                                                                padding: "8px 16px",
                                                                                display: "inline-block",
                                                                                borderRadius: "4px",
                                                                                margin: "0 !important"
                                                                            }}
                                                                        ></ListItemText>
                                                                )
                                                            }
                                                            {
                                                                message.status === 1 &&
                                                                <Box>
                                                                    <Grid container justify="flex-end">
                                                                        {
                                                                            message.images && message.images.length > 0 &&
                                                                            message.images.split('|').filter((image) => image !== '').map((item, index) => (
                                                                                <Grid key={index} item xs={
                                                                                    (message.images.split('|').filter((image) => image !== '').length === 1)
                                                                                        ? 12
                                                                                        : (message.images.split('|').filter((image) => image !== '').length === 2)
                                                                                            ? 6
                                                                                            : 4
                                                                                }>
                                                                                    <img
                                                                                        src={item}
                                                                                        alt={item}
                                                                                        loading="lazy"
                                                                                        style={{
                                                                                            width: "100%",
                                                                                            height: "100%",
                                                                                            borderRadius: "8px",
                                                                                            cursor: "pointer"
                                                                                        }}
                                                                                        onClick={() => {
                                                                                            setCurImage(item);
                                                                                            setOpenDialog(true);
                                                                                        }}
                                                                                    />
                                                                                </Grid>
                                                                            ))
                                                                        }
                                                                    </Grid>
                                                                </Box>
                                                            }
                                                        </Box>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ListItemText
                                                        align="right"
                                                        secondary={getTimeDifference(message.createdAt)}
                                                    ></ListItemText>
                                                </Grid>
                                            </Grid>
                                        }
                                        {
                                            (message.userId && message.createdAt) &&
                                            <Grid container>
                                                <Grid item xs={12} sx={{ display: "flex", alignItems: "end" }}>
                                                    <ListItemIcon>
                                                        <Avatar alt={selectedRoom.name} src={selectedRoom.avatar} />
                                                    </ListItemIcon>
                                                    <Tooltip title={convertToDateTimeStr(message, "createdAt", true)}

                                                    >
                                                        <Box sx={{ width: message.images ? "35%" : "fit-content", overFlow: "hidden" }}>
                                                            {
                                                                message.text &&
                                                                <ListItemText
                                                                    align="left"
                                                                    primary={
                                                                        message.status === 1 ? message.text : "Người dùng đã xóa tin nhắn"
                                                                    }
                                                                    primaryTypographyProps={{
                                                                        backgroundColor: message.status === 1 ? theme.palette.primary.main : theme.palette.action.hover,
                                                                        color: message.status === 1 ? theme.palette.primary.contrastText : theme.palette.text,
                                                                        border: message.status === 0 ? `1px solid` : "none",
                                                                        borderColor: message.status === 0 ? theme.palette.text : "",
                                                                        padding: "8px 16px",
                                                                        display: "inline-block",
                                                                        borderRadius: "4px",
                                                                        margin: "0 !important"
                                                                    }}
                                                                ></ListItemText>
                                                            }
                                                            <Box>
                                                                <Grid container justify="flex-end">
                                                                    {
                                                                        message.images && message.images.length > 0 &&
                                                                        message.images.split('|').filter((image) => image !== '').map((item, index) => (
                                                                            <Grid key={index} item xs={
                                                                                (message.images.split('|').filter((image) => image !== '').length === 1)
                                                                                    ? 12
                                                                                    : (message.images.split('|').filter((image) => image !== '').length === 2)
                                                                                        ? 6
                                                                                        : 4
                                                                            } /* sx={{ display: "flex", alignItems: "center", justifyContent: "end" }} */>
                                                                                <img
                                                                                    src={item}
                                                                                    alt={item}
                                                                                    loading="lazy"
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        height: "100%",
                                                                                        borderRadius: "8px",
                                                                                        cursor: "pointer"
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        setCurImage(item);
                                                                                        setOpenDialog(true);
                                                                                    }}
                                                                                />
                                                                            </Grid>
                                                                        ))
                                                                    }
                                                                </Grid>
                                                            </Box>

                                                        </Box>
                                                    </Tooltip>
                                                </Grid>
                                                <Grid item xs={12} sx={{ paddingLeft: "56px" }}>
                                                    <ListItemText
                                                        align="left"
                                                        secondary={getTimeDifference(message.createdAt)}
                                                    ></ListItemText>
                                                </Grid>
                                            </Grid>
                                        }
                                    </ListItem>
                                ))
                            }
                        </List>
                        <Divider />
                        <ChatSendMessage />
                    </>
                    : (
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexDirection: "column"
                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "220px",
                                    height: "220px",
                                    overflow: "hidden",
                                    borderRadius: "300px",
                                    boxShadow: "rgba(0, 0, 0, 0.06) 0px 3px 5px -1px, rgba(0, 0, 0, 0.043) 0px 6px 10px 0px, rgba(0, 0, 0, 0.035) 0px 1px 18px 0px",
                                    backgroundColor: theme.palette.grey[50]
                                }}
                            >
                                <ChatIcon
                                    sx={{
                                        useSelect: "none",
                                        fontSize: "5em",
                                        color: theme.palette.primary.main,
                                        textAlign: "center"
                                    }}
                                />
                            </Box>
                            <Paragraph sx={{ margin: "16px 0" }}>Hãy chọn liên hệ</Paragraph>
                        </Box>
                    )

            }

            <Dialog open={isOpenDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent sx={{ padding: 0 }}>
                    <img
                        src={currentImage}
                        alt="message image"
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ChatContent;