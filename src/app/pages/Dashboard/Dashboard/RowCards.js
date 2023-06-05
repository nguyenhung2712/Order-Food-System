import {
    Box, Card, Fab, Grid, Hidden, Icon, IconButton,
    styled, useTheme, lighten, List, ListItemText,
    Dialog, DialogTitle, DialogContent, DialogContentText, Chip,
    ListItemButton, Collapse, ListItemIcon
} from '@mui/material';
import { Span } from '../../../components/Typography';
import { Fragment, useState } from 'react';
import React from 'react';
import { convertToDateTimeStr } from '../../../utils/utils';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const ProjectName = styled(Span)(({ theme }) => ({
    marginLeft: 24,
    fontWeight: '500',
    [theme.breakpoints.down('sm')]: { marginLeft: 4 },
}));

const RowCards = ({ data }) => {
    const { palette } = useTheme();
    const textMuted = palette.text.secondary;
    const [openSchedule, setOpenSchedule] = useState(false);
    const [currentEvent, setCurrentEvent] = useState({});
    const [isExpandStaff, setExpandStaff] = useState(false);

    const handleCloseSchedule = async () => {
        setOpenSchedule(false);
    }
    return (
        <>
            {
                data.map((schedule, index) => (
                    <Fragment key={index}>
                        <Card sx={{ py: 1, px: 2 }} className="project-card">
                            <Grid container alignItems="center">
                                <Grid item md={4} xs={7}>
                                    <Box display="flex" alignItems="center">
                                        <Hidden smDown>
                                            <Fab
                                                sx={{
                                                    color: "#fff",
                                                    backgroundColor: schedule.color,
                                                    '&:hover': {
                                                        backgroundColor: lighten(schedule.color, 0.5)
                                                    }
                                                }}
                                            >
                                                <Icon>{schedule.type.icon}</Icon>
                                            </Fab>
                                        </Hidden>
                                        <ProjectName>{schedule.title}</ProjectName>
                                    </Box>
                                </Grid>

                                <Grid item md={4} xs={4}>
                                    <Box color={textMuted}>{convertToDateTimeStr(schedule, "start", true)}</Box>
                                </Grid>

                                <Grid item md={4} xs={1}>
                                    <Box display="flex" justifyContent="flex-end">
                                        <IconButton onClick={() => {
                                            setCurrentEvent(schedule);
                                            setOpenSchedule(true);
                                        }}>
                                            <Icon>visibility</Icon>
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Card>
                        <Box py={1} />
                    </Fragment>
                ))
            }
            {
                currentEvent &&
                <Dialog
                    open={openSchedule}
                    onClose={handleCloseSchedule}
                    aria-labelledby="add-schedule"
                    sx={{
                        '& .MuiPaper-root': { backgroundColor: currentEvent.color },
                        '& .MuiDialog-paper': {
                            minWidth: "500px"
                        }
                    }}
                >
                    <DialogTitle
                        id="add-schedule"
                        sx={{ color: currentEvent.color ? "#FAFAFA" : "" }}
                    >Thông tin lịch trình</DialogTitle>
                    <DialogContent>
                        <Box sx={{
                            color: currentEvent.color ? "#F5F5F4" : "",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <Box>
                                <Span sx={{ display: "block", fontWeight: "bold", fontSize: "16px", textTransform: "capitalize" }}>{currentEvent.title}</Span>
                                <Span sx={{ display: "block" }}>{convertToDateTimeStr(currentEvent, "start", true) + " - " + convertToDateTimeStr(currentEvent, "end", true)}</Span>
                            </Box>
                            <Chip label={currentEvent.type && currentEvent.type.typeName} style={{
                                backgroundColor: "#ffffff4d",
                                color: "#fff"
                            }} />
                        </Box>
                        <List
                            sx={{
                                width: '100%', bgcolor: currentEvent.color,
                                color: "background.paper",
                                border: "1px solid",
                                borderColor: "background.paper",
                                borderRadius: "5px",
                                padding: 0,
                                marginTop: "20px"
                            }}
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            <ListItemButton onClick={() => setExpandStaff(prev => !prev)} sx={{
                                "&:hover": {
                                    backgroundColor: "#ffffff4d"
                                }
                            }}>
                                <ListItemIcon sx={{ color: "background.paper" }}>
                                    <PeopleAltIcon />
                                </ListItemIcon>
                                <ListItemText primary="Nhân viên được phân công/tham dự" />
                                {isExpandStaff ? <ExpandLess /> : <ExpandMore />}
                            </ListItemButton>
                            <Collapse in={isExpandStaff} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {
                                        currentEvent.AdminSchedules && currentEvent.AdminSchedules.length > 0 &&
                                        currentEvent.AdminSchedules.map((adminSchedule, index) => (
                                            <ListItemButton key={index} sx={{
                                                pl: 4,
                                                color: "background.paper",
                                                "&:hover": {
                                                    backgroundColor: "#ffffff4d"
                                                }
                                            }}>
                                                <ListItemText
                                                    primary={adminSchedule.admin.fullname}
                                                    secondary={adminSchedule.admin.email}
                                                    primaryTypographyProps={{
                                                        fontSize: "15px",
                                                        color: "background.paper",
                                                        fontWeight: "500"
                                                    }}
                                                    secondaryTypographyProps={{
                                                        fontSize: "12px",
                                                        color: "background.paper",
                                                        fontWeight: "300"
                                                    }}
                                                />
                                            </ListItemButton>
                                        ))
                                    }
                                </List>
                            </Collapse>
                        </List>
                    </DialogContent>
                </Dialog >
            }
        </>
    );
};

export default RowCards;
