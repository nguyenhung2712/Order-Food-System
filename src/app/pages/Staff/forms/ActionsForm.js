import { useState } from "react";
import React from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box, Divider, Skeleton,
    Button, styled, Backdrop, CircularProgress
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import NotInterestedIcon from "@mui/icons-material/NotInterested";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import swal from "sweetalert";
import { CSVLink } from 'react-csv';

import { Span } from "../../../components/Typography";
import StaffService from "../../../services/staff.service";
import { update } from "../../../redux/actions/StaffActions";

const CustomButton = styled(Button)(({ theme }) => ({
    height: 60,
    whiteSpace: 'pre',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    fontSize: '16px',
    '&:hover': { background: 'rgba(255, 255, 255, 0.08)' },
    '& svg': {
        width: "50px",
        fontSize: '24px',
        paddingLeft: '16px',
        verticalAlign: 'middle',
    },
}));

const ActionsForm = ({ data, setRender }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState();

    const handleDisable = async (id) => {
        setLoading(true);
        swal({
            title: "Cảnh báo",
            text: "Đồng ý vô hiệu hóa tài khoản nhân viên ?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    let newDate = new Date().toLocaleString();
                    StaffService.updateStaff(id, { status: 3, disabledAt: newDate })
                        .then(res => {
                            dispatch(update(id, { status: 3, disabledAt: newDate }));
                            setLoading(false);
                            setRender(curr => !curr);
                        });
                } else {
                    setLoading(false);
                }
            });
    }

    const handleRemove = async (id) => {
        setLoading(true);
        swal({
            title: "Cảnh báo",
            text: "Sau khi xóa sẽ không thể khôi phục. Đồng ý xóa ?",
            icon: "warning",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    setLoading(false);
                    StaffService.removeStaff(id)
                        .then(res => {
                            navigate("/staff/manage");
                        });
                } else {
                    setLoading(false);
                }
            });
    }

    const handleAprrove = async (id) => {
        swal({
            title: "Xác nhận tài khoản",
            text: "Đồng ý xác nhận tài khoản của nhân viên ?",
            icon: "info",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(async (result) => {
                if (result) {
                    setLoading(true);
                    await StaffService.approveStaff(id)
                        .then(res => {
                            setLoading(false);
                            swal({
                                title: "Thành công",
                                text: "Xác nhận tài khoản nhân viên thành công",
                                icon: "success"
                            });
                            dispatch(update(id, { isActived: 1 }));
                            setRender(curr => !curr);
                        });
                }
            });
    }

    if (!data) {
        return (
            <Box sx={{ width: "100%", marginBottom: "12px" }}>
                <Skeleton
                    variant="rounded" width={"100%"}
                    height={"450px"}
                />
            </Box>
        );
    }

    return (
        <Box>
            <Divider />
            <Box
                sx={{
                    padding: "16px"
                }}
            >
                {
                    data.status !== 3 &&
                    <Box>
                        <CustomButton
                            onClick={() => handleDisable(data.id)}
                        >
                            <NotInterestedIcon sx={{ marginRight: 2 }} />
                            Vô hiệu hóa tài khoản
                        </CustomButton>
                    </Box>
                }
                {
                    data.isActived === 0 &&
                    <Box>
                        <CustomButton
                            onClick={() => handleAprrove(data.id)}
                        >
                            <CheckCircleIcon sx={{ marginRight: 2 }} />
                            Xác nhận tài khoản
                        </CustomButton>
                    </Box>
                }
                <Box>
                    <CustomButton>
                        <CSVLink
                            data={[data]}
                            filename={`${data.username}-staff-data.csv`}
                            target="_blank"
                        >
                            <FileDownloadIcon sx={{ marginRight: 2 }} />
                            Xuất dữ liệu
                        </CSVLink>
                    </CustomButton>
                </Box>
                <Box
                    sx={{
                        paddingLeft: "24px",
                        margin: "8px 4px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            fontSize: "13px",
                            color: "#6B7280",
                        }}
                    >
                        <InfoIcon sx={{ marginRight: 2 }} />
                        Khi xóa, dữ liệu sẽ không thể khôi phục.
                    </Box>
                    <LoadingButton
                        type="button"
                        color="primary"
                        loading={loading}
                        variant="contained"
                        sx={{ mt: 2 }}
                        onClick={() => handleRemove(data.id)}
                    >
                        <DeleteIcon />
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Xóa tài khoản</Span>
                    </LoadingButton>
                </Box>

            </Box>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default ActionsForm;
