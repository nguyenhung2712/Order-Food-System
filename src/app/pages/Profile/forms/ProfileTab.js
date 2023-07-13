import React from 'react';
import {
	Box, List, ListItem, ListItemText,
	ListItemButton, ListItemIcon
} from "@mui/material";
import { useTheme, styled } from "@mui/system";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DevicesIcon from '@mui/icons-material/Devices';

const CustomListButton = styled(ListItemButton)(({ theme }) => ({
	"&.Mui-selected": {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.background.default,
		"&:before": {
			left: 0,
			width: "4px",
			content: '""',
			height: "100%",
			position: "absolute",
			transition: "all 0.3s ease 0s",
			backgroundColor: theme.palette.primary.main,
		},
		"&:hover": {
			backgroundColor: "rgba(25, 118, 210, 0.04)",
		}
	},
	":hover": {
		color: theme.palette.primary.main,
		backgroundColor: theme.palette.background.default,
		"&:before": {
			left: 0,
			width: "4px",
			content: '""',
			height: "100%",
			position: "absolute",
			transition: "all 0.3s ease 0s",
			backgroundColor: theme.palette.primary.main,
		},
	}
}));
const CustomListItemIcon = styled(ListItemIcon)(({ theme }) => ({
	minWidth: "35px"
}));

const ProfileTab = ({ onClickTab, value, isUsedCard }) => {
	const { palette } = useTheme();

	return (
		<>
			{
				isUsedCard
					? (
						<Box sx={{
							backgroundColor: palette.background.paper,
							color: palette.text.primary,
							"transition": "box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms", "overflow": "hidden", "boxShadow": "rgba(0, 0, 0, 0.06) 0px 3px 3px -2px, rgba(0, 0, 0, 0.04) 0px 3px 4px 0px, rgba(0, 0, 0, 0.04) 0px 1px 8px 0px !important",
							"borderRadius": "8px",
						}}>
							<List>
								<ListItem disablePadding>
									<CustomListButton selected={value === 1}
										onClick={() => onClickTab(1)}
									>
										<CustomListItemIcon>
											<PersonOutlineIcon />
										</CustomListItemIcon>
										<ListItemText primary="Thông tin cơ bản" />
									</CustomListButton>
								</ListItem>
								<ListItem disablePadding>
									<CustomListButton selected={value === 2}
										onClick={() => onClickTab(2)}
									>
										<CustomListItemIcon>
											<LockOutlinedIcon />
										</CustomListItemIcon>
										<ListItemText primary="Mật khẩu" />
									</CustomListButton>
								</ListItem>
								<ListItem disablePadding>
									<CustomListButton selected={value === 3}
										onClick={() => onClickTab(3)}
									>
										<CustomListItemIcon>
											<DevicesIcon />
										</CustomListItemIcon>
										<ListItemText primary="Trình duyệt đăng nhập" />
									</CustomListButton>
								</ListItem>
							</List>
						</Box>
					)
					: (
						<List>
							<ListItem disablePadding>
								<CustomListButton selected={value === 1}
									onClick={() => onClickTab(1)}
								>
									<CustomListItemIcon>
										<PersonOutlineIcon />
									</CustomListItemIcon>
									<ListItemText primary="Thông tin cơ bản" />
								</CustomListButton>
							</ListItem>
							<ListItem disablePadding>
								<CustomListButton selected={value === 2}
									onClick={() => onClickTab(2)}
								>
									<CustomListItemIcon>
										<LockOutlinedIcon />
									</CustomListItemIcon>
									<ListItemText primary="Mật khẩu" />
								</CustomListButton>
							</ListItem>
							<ListItem disablePadding>
								<CustomListButton selected={value === 3}
									onClick={() => onClickTab(3)}
								>
									<CustomListItemIcon>
										<DevicesIcon />
									</CustomListItemIcon>
									<ListItemText primary="Trình duyệt đăng nhập" />
								</CustomListButton>
							</ListItem>
						</List>
					)
			}
		</>

	)
}

export default ProfileTab