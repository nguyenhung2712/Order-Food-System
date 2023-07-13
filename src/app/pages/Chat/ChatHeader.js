import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, IconButton, Box, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppContext } from '../../contexts/AppContext';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '@mui/system';
import { H5 } from "../../components/Typography";
import ShortTextIcon from '@mui/icons-material/ShortText';
/* import MoreVertIcon from '@mui/icons-material/MoreVert'; */

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

const ChatHeader = ({ onToggleUserList }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { selectedRoom } = React.useContext(AppContext);
    const { user: { id } } = useAuth();

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: theme.palette.primary.main,
                padding: "9px 4px 10px"
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center"
                }}
            >
                <IconButton
                    sx={{ color: theme.palette.primary.contrastText }}
                    onClick={onToggleUserList}
                >
                    <ShortTextIcon />
                </IconButton>
                {
                    selectedRoom
                    && Object.keys(selectedRoom).length !== 0 &&
                    <>
                        <Box sx={{ cursor: "pointer" }}
                            onClick={() => {
                                navigate(`/customer/${selectedRoom.userId}`)
                            }}
                        >
                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar alt={selectedRoom.name} src={selectedRoom.avatar} />
                            </StyledBadge>
                        </Box>
                        <H5
                            sx={{
                                color: theme.palette.primary.contrastText,
                                marginLeft: "16px",
                                cursor: "pointer"
                            }}
                            onClick={() => {
                                navigate(`/customer/${selectedRoom.userId}`)
                            }}
                        >{selectedRoom.name}</H5>
                    </>
                }

            </Box>
            {/* <Box className="MuiBox-root css-1uf0tls">
                <IconButton
                    sx={{ color: theme.palette.primary.contrastText }}
                >
                    <MoreVertIcon />
                </IconButton>
            </Box> */}
        </Box>
    )
}

export default ChatHeader;