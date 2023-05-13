import React from 'react';
import {
    Avatar, TextField, Divider, Grid,
    ListItemText, ListItemIcon, ListItem, List, ListItemButton
} from '@mui/material';

const UserChatList = ({ data, setCurConver, classes }) => {

    return (
        <Grid item xs={3} className={classes.borderRight500}>
            <List>
                <ListItem button key="RemySharp">
                    <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                    </ListItemIcon>
                    <ListItemText primary="John Wick"></ListItemText>
                </ListItem>
            </List>
            <Divider />
            <Grid item xs={12} style={{ padding: '10px' }}>
                <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth />
            </Grid>
            <Divider />
            <List>
                {
                    data &&
                    data.map((conver, index) => (
                        <ListItemButton
                            key={index}
                            onClick={() => setCurConver(conver)}
                        >
                            <ListItemIcon>
                                <Avatar alt="Remy Sharp" src={conver.user.avatar} />
                            </ListItemIcon>
                            <ListItemText primary={conver.name}></ListItemText>
                            {/* <ListItemText secondary="online" align="right"></ListItemText> */}
                        </ListItemButton>
                    ))
                }
                {/* <ListItem button key="Alice">
                    <ListItemIcon>
                        <Avatar alt="Alice" src="https://material-ui.com/static/images/avatar/3.jpg" />
                    </ListItemIcon>
                    <ListItemText primary="Alice">Alice</ListItemText>
                </ListItem>
                <ListItem button key="CindyBaker">
                    <ListItemIcon>
                        <Avatar alt="Cindy Baker" src="https://material-ui.com/static/images/avatar/2.jpg" />
                    </ListItemIcon>
                    <ListItemText primary="Cindy Baker">Cindy Baker</ListItemText>
                </ListItem> */}
            </List>
        </Grid>
    )
}

export default UserChatList