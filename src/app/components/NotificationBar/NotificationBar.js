import {
    Badge, Button, Card, Drawer, Icon, IconButton,
    ThemeProvider, Menu, MenuItem, lighten,
    Tabs, Tab
} from '@mui/material';
import { Box, styled, useTheme } from '@mui/system';
/* import useNotification from '../../hooks/useNotification'; */
import useSettings from '../../hooks/useSettings';
import { sideNavWidth, topBarHeight } from '../../utils/constant';
import { getTimeDifference } from '../../utils/utils.js';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { themeShadows } from '../MatxTheme/themeColors';
import { Paragraph, Small, Span } from '../Typography';
import { AppContext } from '../../contexts/AppContext';
import useAuth from '../../hooks/useAuth';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CheckIcon from '@mui/icons-material/Check';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import { db } from '../../services/firebase/config';
import {
    doc, updateDoc, arrayUnion, arrayRemove,
    collection, query, onSnapshot, where, writeBatch, getDocs
} from 'firebase/firestore';
import { TabPanel, a11yProps } from "../../components/TabPanel";

const Notification = styled('div')(() => ({
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    height: topBarHeight,
    boxShadow: themeShadows[6],
    '& h5': {
        marginLeft: '8px',
        marginTop: 0,
        marginBottom: 0,
        fontWeight: '500',
    },
}));

const NotificationCard = styled(Box)(({ theme }) => ({
    position: 'relative',
    /* '&:hover': {
        '& .messageTime': {
            display: 'none',
        },
        '& .deleteButton': {
            opacity: '1',
        },
    }, */
    '& .messageTime': {
        color: theme.palette.text.secondary,
    },
    '& .icon': { fontSize: '1.25rem' },
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
    opacity: '0',
    position: 'absolute',
    right: 5,
    marginTop: 9,
    marginRight: '24px',
    background: 'rgba(0, 0, 0, 0.01)',
}));

const CardLeftContent = styled('div')(({ theme }) => ({
    padding: '12px 8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(0, 0, 0, 0.01)',
    '& small': {
        fontWeight: '500',
        marginLeft: '16px',
        color: theme.palette.text.secondary,
    },
}));

const Heading = styled('span')(({ theme }) => ({
    fontWeight: '500',
    marginLeft: '16px',
    color: theme.palette.text.secondary,
}));

const NotificationBar = ({ container }) => {
    const { settings } = useSettings();
    const theme = useTheme();
    const secondary = theme.palette.text.secondary;
    const [tabValue, setTabValue] = React.useState(0);
    const [panelOpen, setPanelOpen] = React.useState(false);
    const [unreadTotal, setUnreadTotal] = React.useState(0);
    const [grAnchorEl, setGrAnchorEl] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [isHideMenuBtn, setHideMenuBtn] = React.useState(null);
    const [selectedNotification, setNotification] = React.useState(null);
    const openGrMenu = Boolean(grAnchorEl);
    const openMenu = Boolean(anchorEl);
    /* console.log(theme); */
    const { notifications } = React.useContext(AppContext);
    const { user: { id } } = useAuth();
    /* console.log(notifications); */
    const handleDrawerToggle = () => {
        setPanelOpen(!panelOpen);
    };

    const handleClickGrMenu = (event) => {
        setGrAnchorEl(event.currentTarget);
    };
    const handleCloseGrMenu = () => {
        setGrAnchorEl(null);
    };

    const handleClickMenu = (event, notification) => {
        setNotification(notification);
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setNotification(null);
        setAnchorEl(null);
    };
    const handleChangeTabValue = (e, newValue) => {
        setTabValue(newValue);
    };

    const { palette } = useTheme();
    const textColor = palette.text.primary;

    React.useEffect(() => {
        setUnreadTotal(notifications.filter(notification => !notification.readBy.includes(id)).length);
    }, [notifications]);

    async function handleReadNotification(notifyId, userId) {
        const docRef = doc(db, "notifications", notifyId);

        await updateDoc(docRef, {
            readBy: arrayUnion(userId)
        })
    }

    async function handleUnreadNotification(notifyId, userId) {
        const docRef = doc(db, "notifications", notifyId);

        await updateDoc(docRef, {
            readBy: arrayRemove(userId)
        })
    }

    async function handleReadAll(userId) {
        const notificationRef = collection(db, 'notifications');
        const querySnapshot = await getDocs(query(notificationRef, where('receivedId', 'array-contains', id)));

        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { readBy: arrayUnion(userId) });
        });

        await batch.commit();
    }

    async function handleRemoveNotification(notifyId, userId) {
        const docRef = doc(db, "notifications", notifyId);

        await updateDoc(docRef, {
            receivedId: arrayRemove(userId)
        })
    }

    return (
        <Fragment>
            <IconButton onClick={handleDrawerToggle}>
                <Badge color="secondary" badgeContent={unreadTotal > 10 ? "9+" : unreadTotal} invisible={unreadTotal === 0}>
                    <Icon sx={{ color: textColor }}>notifications</Icon>
                </Badge>
            </IconButton>

            <ThemeProvider theme={settings.themes[settings.activeTheme]}>
                <Drawer
                    container={container}
                    variant="temporary"
                    anchor={'right'}
                    open={panelOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    PaperProps={{
                        sx: { width: "400px" },
                    }}
                >
                    <Box>
                        <Notification style={{
                            display: "flex",
                            alignItems: 'center',
                            justifyContent: "space-between",
                            margin: 0
                        }}>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <Icon color="primary">notifications</Icon>
                                <h5>Thông báo</h5>
                            </Box>
                            <IconButton onClick={handleClickGrMenu}>
                                <MoreHorizIcon />
                            </IconButton>
                            <Menu
                                id="gr-menu"
                                anchorEl={grAnchorEl}
                                open={openGrMenu}
                                onClose={handleCloseGrMenu}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => {
                                    handleReadAll(id);
                                    handleCloseGrMenu();
                                }}>
                                    <CheckIcon sx={{ marginRight: "8px" }} />
                                    <Span>Đánh dấu tất cả đã đọc</Span>
                                </MenuItem>
                            </Menu>
                        </Notification>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={tabValue} onChange={handleChangeTabValue}
                                aria-label="basic tabs example"
                                variant="fullWidth"
                            >
                                <Tab label="Tất cả" {...a11yProps(0)} />
                                <Tab label="Chưa đọc" {...a11yProps(1)} />
                            </Tabs>
                        </Box>
                        <TabPanel value={tabValue} index={0}>
                            {
                                notifications.map((notification) => (
                                    <NotificationCard key={notification.id}
                                        sx={{
                                            position: "relative"
                                        }}
                                        onMouseLeave={() => {
                                            setHideMenuBtn(true);
                                        }}
                                        onMouseMove={() => {
                                            setNotification(notification);
                                            setHideMenuBtn(false);
                                        }}
                                    >
                                        <DeleteButton
                                            size="small"
                                            className="deleteButton"
                                        /* onClick={() => deleteNotification(notification.id)} */
                                        >
                                            <Icon className="icon">clear</Icon>
                                        </DeleteButton>
                                        <Link
                                            to={`${notification.staffPath}`}
                                            onClick={async () => {
                                                await handleReadNotification(notification.id, id);
                                            }}
                                            target="_blank"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <Card sx={{ mx: 2, mb: 3, position: "relative" }} elevation={3}>
                                                <CardLeftContent>
                                                    <Heading>{notification.title}</Heading>
                                                    <Small className="messageTime">
                                                        {getTimeDifference(new Date(notification.createdAt))}
                                                    </Small>
                                                </CardLeftContent>
                                                <Box sx={{ px: 2, pt: 1, pb: 2, paddingRight: "26px" }}>
                                                    <Paragraph sx={{ m: 0 }}>{notification.message}</Paragraph>
                                                    {/* <Small sx={{ color: secondary }}>{notification.subtitle}</Small> */}
                                                </Box>
                                                {
                                                    !notification.readBy.includes(id) &&
                                                    <Badge color="primary" variant="dot" badgeContent=" " sx={{
                                                        position: "absolute",
                                                        right: "16px",
                                                        top: "75%"
                                                    }} />
                                                }
                                            </Card>
                                        </Link>
                                        {
                                            !isHideMenuBtn && (selectedNotification && selectedNotification.id === notification.id) &&
                                            <>
                                                <IconButton onClick={(e) => handleClickMenu(e, notification)} sx={{
                                                    zIndex: 9999,
                                                    position: "absolute",
                                                    right: "16px",
                                                    top: "50%",
                                                    backgroundColor: theme.palette.background.paper,
                                                    '&:hover': {
                                                        backgroundColor: "#f0f0f0",
                                                    }
                                                }}>
                                                    <MoreHorizIcon />
                                                </IconButton>
                                                <Menu
                                                    id={`${notification.id}-menu`}
                                                    anchorEl={anchorEl}
                                                    open={openMenu}
                                                    onClose={handleCloseMenu}
                                                    MenuListProps={{
                                                        'aria-labelledby': 'basic-button',
                                                    }}
                                                >
                                                    {
                                                        !notification.readBy.includes(id)
                                                            ? (
                                                                <MenuItem onClick={(e) => {
                                                                    handleReadNotification(selectedNotification.id, id)
                                                                    handleCloseMenu();
                                                                }}>
                                                                    <CheckIcon sx={{ marginRight: "8px" }} />
                                                                    <Span>Đánh dấu là đã đọc</Span>
                                                                </MenuItem>
                                                            )
                                                            : (
                                                                <MenuItem onClick={(e) => {
                                                                    handleUnreadNotification(selectedNotification.id, id)
                                                                    handleCloseMenu();
                                                                }}>
                                                                    <CheckIcon sx={{ marginRight: "8px" }} />
                                                                    <Span>Đánh dấu là chưa đọc</Span>
                                                                </MenuItem>
                                                            )
                                                    }
                                                    <MenuItem onClick={(e) => {
                                                        handleRemoveNotification(selectedNotification.id, id);
                                                        handleCloseMenu();
                                                    }}>
                                                        <CancelPresentationIcon sx={{ marginRight: "8px" }} />
                                                        <Span>Gỡ thông báo</Span>
                                                    </MenuItem>
                                                </Menu>
                                            </>
                                        }
                                    </NotificationCard>
                                ))
                            }
                        </TabPanel>
                        <TabPanel value={tabValue} index={1}>
                            {
                                notifications
                                    .filter(notification => !notification.readBy.includes(id))
                                    .map((notification) => (
                                        <NotificationCard key={notification.id}
                                            sx={{
                                                position: "relative"
                                            }}
                                            onMouseLeave={() => {
                                                setHideMenuBtn(true);
                                            }}
                                            onMouseMove={() => {
                                                setNotification(notification);
                                                setHideMenuBtn(false);
                                            }}
                                        >
                                            <DeleteButton
                                                size="small"
                                                className="deleteButton"
                                            /* onClick={() => deleteNotification(notification.id)} */
                                            >
                                                <Icon className="icon">clear</Icon>
                                            </DeleteButton>
                                            <Link
                                                to={`${notification.staffPath}`}
                                                onClick={async () => {
                                                    await handleReadNotification(notification.id, id);
                                                }}
                                                target="_blank"
                                                style={{ textDecoration: 'none' }}
                                            >
                                                <Card sx={{ mx: 2, mb: 3, position: "relative" }} elevation={3}>
                                                    <CardLeftContent>
                                                        <Heading>{notification.title}</Heading>
                                                        <Small className="messageTime">
                                                            {getTimeDifference(new Date(notification.createdAt))}
                                                        </Small>
                                                    </CardLeftContent>
                                                    <Box sx={{ px: 2, pt: 1, pb: 2, paddingRight: "26px" }}>
                                                        <Paragraph sx={{ m: 0 }}>{notification.message}</Paragraph>
                                                        {/* <Small sx={{ color: secondary }}>{notification.subtitle}</Small> */}
                                                    </Box>
                                                    {
                                                        !notification.readBy.includes(id) &&
                                                        <Badge color="primary" variant="dot" badgeContent=" " sx={{
                                                            position: "absolute",
                                                            right: "16px",
                                                            top: "75%"
                                                        }} />
                                                    }
                                                </Card>
                                            </Link>
                                            {
                                                !isHideMenuBtn && (selectedNotification && selectedNotification.id === notification.id) &&
                                                <>
                                                    <IconButton onClick={(e) => handleClickMenu(e, notification)} sx={{
                                                        zIndex: 9999,
                                                        position: "absolute",
                                                        right: "16px",
                                                        top: "50%",
                                                        backgroundColor: theme.palette.background.paper,
                                                        '&:hover': {
                                                            backgroundColor: "#f0f0f0",
                                                        }
                                                    }}>
                                                        <MoreHorizIcon />
                                                    </IconButton>
                                                    <Menu
                                                        id={`${notification.id}-menu`}
                                                        anchorEl={anchorEl}
                                                        open={openMenu}
                                                        onClose={handleCloseMenu}
                                                        MenuListProps={{
                                                            'aria-labelledby': 'basic-button',
                                                        }}
                                                    >
                                                        {
                                                            !notification.readBy.includes(id)
                                                                ? (
                                                                    <MenuItem onClick={(e) => {
                                                                        handleReadNotification(selectedNotification.id, id)
                                                                        handleCloseMenu();
                                                                    }}>
                                                                        <CheckIcon sx={{ marginRight: "8px" }} />
                                                                        <Span>Đánh dấu là đã đọc</Span>
                                                                    </MenuItem>
                                                                )
                                                                : (
                                                                    <MenuItem onClick={(e) => {
                                                                        handleUnreadNotification(selectedNotification.id, id)
                                                                        handleCloseMenu();
                                                                    }}>
                                                                        <CheckIcon sx={{ marginRight: "8px" }} />
                                                                        <Span>Đánh dấu là chưa đọc</Span>
                                                                    </MenuItem>
                                                                )
                                                        }
                                                        <MenuItem onClick={(e) => {
                                                            handleRemoveNotification(selectedNotification.id, id);
                                                            handleCloseMenu();
                                                        }}>
                                                            <CancelPresentationIcon sx={{ marginRight: "8px" }} />
                                                            <Span>Gỡ thông báo</Span>
                                                        </MenuItem>
                                                    </Menu>
                                                </>
                                            }
                                        </NotificationCard>
                                    ))
                            }
                        </TabPanel>
                        {/* {!!notifications.length && (
                            <Box sx={{ color: secondary }}>
                                <Button onClick={clearNotifications}>Clear Notifications</Button>
                            </Box>
                        )} */}
                    </Box>
                </Drawer>
            </ThemeProvider>
        </Fragment>
    );
};

export default NotificationBar;
