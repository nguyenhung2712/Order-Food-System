import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Chip, Typography, Avatar,
    Box, Divider,
    Tabs, Tab,
    Card, CardMedia, Stack
} from "@mui/material";

import { H2, Paragraph, H3, H1 } from "../../../components/Typography";

const UserInfo = ({ data }) => {
    return (
        <div>
            {
                data && 
                <Box>
                    <Divider />
                    <Stack 
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                        sx={{ paddingBottom: 3, paddingTop: 3 }}
                    >
                        <CardMedia
                            sx={{ 
                                height: 70,
                                width: 70,
                                objectFit: "fit",
                                borderRadius: "50%"
                            }}
                            image="https://matx-react.ui-lib.com/assets/images/faces/10.jpg"
                            title="green iguana"
                        />
                        <H3>{ data.firstName + " " + data.lastName }</H3>
                    </Stack>
                    <Divider />
                    <TableContainer 
                        component={Paper}
                        sx={{ boxShadow: "none" }}
                    >
                        <Table  aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Email</TableCell>
                                    <TableCell align="left">
                                        <Paragraph
                                            sx={{ fontSize: "13px" }}
                                        >{ data.email }</Paragraph>
                                        <Chip 
                                            label={ data.isActive ? "Đã xác thực" : "Chưa xác thực" }
                                            color={ data.isActive ? "info" : "warning" }
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell sx={{ paddingLeft: 4 }}>Số điện thoại</TableCell>
                                    <TableCell align="left">{ data.phoneNum ? data.phoneNum : <i>Người dùng chưa nhập</i> }</TableCell>
                                </TableRow>
                                {/* các địa chỉ (map => ...) */}
                            </TableHead>
                        </Table>
                    </TableContainer>
                </Box>
                
            }
        </div>
    );
};

export default UserInfo;
