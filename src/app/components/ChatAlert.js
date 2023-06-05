import { Badge, Icon, IconButton, } from '@mui/material';
import { useTheme } from '@mui/system';
import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';
import { db } from '../services/firebase/config';
import { collection, query, onSnapshot, arrayUnion, where, writeBatch, getDocs } from 'firebase/firestore';
import useAuth from '../hooks/useAuth';

const ChatAlert = () => {
    const { palette } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const textColor = palette.text.primary;
    const { user } = useAuth();
    const [unreadTotal, setUnreadTotal] = useState(0);
    useEffect(() => {
        if (location.pathname === "/chat") {
            setUnreadTotal(0);
        }
    }, [location.pathname])
    useEffect(() => {
        if (location.pathname !== "/chat") {
            const messagesRef = collection(db, 'messages');
            const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
                let total = 0;
                snapshot.docs.forEach((doc) => {
                    const message = doc.data();
                    if (
                        message.roomId &&
                        (message.userId !== user.id && message.adminId !== user.id) &&
                        !message.readBy.includes(user.id)
                    ) {
                        total++;
                    }
                });
                setUnreadTotal(total);
            });
            return () => {
                unsubscribe();
            };
        }

    }, [user.id]);

    return (
        <Fragment>
            <IconButton onClick={() => navigate("/chat")}>
                <Badge color="secondary" badgeContent={unreadTotal} invisible={unreadTotal === 0}>
                    <Icon sx={{ color: textColor }}>chat</Icon>
                </Badge>
            </IconButton>
        </Fragment>
    );
};

export default ChatAlert;
