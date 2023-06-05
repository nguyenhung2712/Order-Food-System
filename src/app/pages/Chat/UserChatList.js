import React, { useState, useEffect } from 'react';
import {
    Avatar, TextField, Divider, Grid, Box,
    ListItemText, ListItemIcon, Badge, List, ListItemButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppContext } from '../../contexts/AppContext';
import { db } from '../../services/firebase/config';
import { collection, query, onSnapshot, arrayUnion, where, writeBatch, getDocs } from 'firebase/firestore';
import useAuth from '../../hooks/useAuth';
import { convertToDateTimeStr } from '../../utils/utils';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: '#44b700',
        color: '#44b700',
        boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
        '&::after': {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
            content: '""',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}));


const UserChatList = ({ classes }) => {
    const { rooms, setSelectedRoomId, selectedRoom } = React.useContext(AppContext);
    const [currentRooms, setCurRooms] = useState([]);
    const [filterText, setFilterText] = useState("");

    const { user } = useAuth();

    useEffect(() => {
        setCurRooms(rooms);
    }, [rooms]);
    useEffect(() => {
        if (currentRooms) {
            if (currentRooms.some(room => room.unreadCount > 0 && room.id === selectedRoom.id)) {
                handleRoomSelect(selectedRoom.id, user.id);
            }
        }
    }, [currentRooms]);

    useEffect(() => {
        const messagesRef = collection(db, 'messages');

        const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
            const roomUnreadCounts = {};

            snapshot.docs.forEach((doc) => {
                const message = doc.data();

                if (
                    message.roomId &&
                    (message.userId !== user.id && message.adminId !== user.id) &&
                    !message.readBy.includes(user.id)
                ) {
                    roomUnreadCounts[message.roomId] = (roomUnreadCounts[message.roomId] || 0) + 1;
                }
            });

            setCurRooms((prevRooms) => {
                return prevRooms.map((room) => {
                    return {
                        ...room,
                        unreadCount: roomUnreadCounts[room.id] || 0
                    };
                });
            });
        });

        return () => {
            unsubscribe();
        };
    }, [user.id]);

    useEffect(() => {
        (async () => {
            if (rooms) {
                setCurRooms(rooms.filter(room => room.name.toLowerCase().indexOf(filterText) > -1
                    || convertToDateTimeStr(room, "createdAt", false).toLowerCase().indexOf(filterText) > -1
                ));
            }
        })()
    }, [filterText])

    const handleSelectRoom = async (event, room) => {
        if (room.unreadCount > 0) {
            handleRoomSelect(room.id, user.id);
        }
        setSelectedRoomId(room.id);
    }

    async function handleRoomSelect(roomId, currentUserId) {
        const messagesRef = collection(db, 'messages');
        const querySnapshot = await getDocs(query(messagesRef, where('roomId', '==', roomId)));

        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { readBy: arrayUnion(currentUserId) });
        });

        await batch.commit();
    }
    return (
        <Box className={classes.borderRight500} sx={{ width: "280px", height: "100%" }}>
            <Divider />
            <Grid item xs={12} style={{ padding: '10px' }}>
                <TextField
                    id="outlined-basic-email"
                    label="Tìm kiếm"
                    variant="outlined" fullWidth
                    onChange={(event) => setFilterText(event.target.value)}
                    size="small"
                />
            </Grid>
            <Divider />
            <List sx={{ height: "100%" }}>
                {
                    currentRooms &&
                    currentRooms.map((room, index) => (
                        <ListItemButton
                            key={index}
                            onClick={(e) => handleSelectRoom(e, room)}
                        >
                            <ListItemIcon>
                                <StyledBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                >
                                    <Avatar alt={room.name} src={room.avatar} />
                                </StyledBadge>
                            </ListItemIcon>
                            <ListItemText primary={room.name}></ListItemText>
                            {
                                room.unreadCount > 0 &&
                                <Badge badgeContent={room.unreadCount} color="success">
                                </Badge>

                            }
                        </ListItemButton>
                    ))
                }
            </List>
        </Box>
    )
}

export default UserChatList