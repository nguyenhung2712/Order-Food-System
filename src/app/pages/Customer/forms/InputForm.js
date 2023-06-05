/* import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider"; */
import { useEffect, useState, useRef } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    FormControl, FormControlLabel, InputLabel, Grid,
    Icon, IconButton, styled, Switch, Select,
    MenuItem, Box, FormLabel, RadioGroup, Radio, Backdrop, CircularProgress,
    Avatar, DialogActions, DialogContent, DialogContentText, Button
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Editor } from '@tinymce/tinymce-react';

import swal from 'sweetalert';

import { SimpleCard } from "../../../components";
import { Span } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import BlogService from "../../../services/blog.service";
import UserService from "../../../services/user.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/BlogActions";

import { H4 } from "../../../components/Typography";
import { deepObjectEqual } from "../../../utils/utils";
import useAuth from '../../../hooks/useAuth';
import CropEasy from '../crop/CropEasy';
import { Crop } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { addDocument } from '../../../services/firebase/service';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
}));

const useStyles = makeStyles({
    button: {
        backgroundColor: '#fff',
        '&:hover': {
            backgroundColor: 'rgb(245, 245, 245)'
        },
    }
})

const InputForm = ({ id }) => {
    const classes = useStyles()
    const editorRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({});
    const [flagState, setFlagState] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [file, setFile] = useState(null);
    const [photoURL, setPhotoURL] = useState("");
    const [openCrop, setOpenCrop] = useState(false);

    const isBlocking = () => {
        return !deepObjectEqual(state, flagState) && !isSuccess;
    }
    usePrompt('Thay đổi của bạn sẽ không được lưu. Đồng ý chuyển trang?', isBlocking());

    useEffect(() => {
        (async () => {
            if (id) {
                await UserService.getUserById(id)
                    .then((res) => {
                        let user = res.data.payload;
                        setFlagState(user);
                        setState(user);
                        setPhotoURL(user.avatar);
                        setFile(user.avatar);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })()
    }, []);

    const handleSubmit = async (event) => {
        setLoading(true);
        let { username, email, ...body } = state;

        let formData = new FormData();
        formData.append("image", file);
        try {
            if (id) {
                let temp = {
                    username, email
                };
                if (username === flagState.username) {
                    delete temp.username;
                }
                if (email === flagState.email) {
                    delete temp.email;
                }
                await UserService.updateUser(id, { ...body, ...temp })
                    .then(async (res) => {
                        await addDocument("notifications", {
                            title: "Cập nhật tài khoản",
                            message: `Thông tin tài khoản của bạn đã được cập nhật. Vui lòng đăng nhập lại.`,
                            usePath: "/my-account/account-details",
                            staffPath: null,
                            readBy: [],
                            image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685217417/insurance.png",
                            receivedId: [id],
                            status: 1
                        });
                        if (formData) {
                            UserService.uploadAvatar(id, formData);
                        }
                    });
            } else {
                await UserService.createUser({ ...state })
                    .then(res => {
                        if (formData) {
                            UserService.uploadAvatar(res.data.payload.id, formData);
                        }
                    });
            }
            setIsSuccess(true);
            swal({
                title: `${id ? "Cập nhật" : "Tạo mới"} thành công`,
                text: "Đồng ý chuyển đến trang quản lý ?",
                icon: "success",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then(result => {
                    if (result) {
                        navigate("/customer/manage");
                    } else {
                        setLoading(false);
                    }
                });
        } catch (err) {
            setIsSuccess(false);
            setLoading(false);
        }
    }
    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setPhotoURL(URL.createObjectURL(file));
            setOpenCrop(true);
        }
    };

    const handleRecover = (event) => {
        setLoading(true);
        swal({
            title: "Khôi phục nội dung",
            text: "Xác nhận khôi phục nội dung này ?",
            icon: "info",
            buttons: ["Hủy bỏ", "Đồng ý"],
        })
            .then(result => {
                if (result) {
                    setState({ ...state, status: 1 });
                    BlogService.recoverBlog(id)
                        .then(res => {
                            setLoading(false);
                            dispatch(recover(id));
                        });
                } else {
                    setLoading(false)
                }
            });
    }

    return (
        <>
            <SimpleCard title={!id ? "Thêm người dùng" : state.status === 0 ? "Chỉnh sửa người dùng (Đã tạm xóa)" : "Chỉnh sửa người dùng"}>
                <Box>
                    <DialogContent dividers>
                        <H4>Ảnh đại diện</H4>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Box sx={{ position: 'relative' }}>
                                <Avatar
                                    src={photoURL}
                                    sx={{ width: 250, height: 250, objectFit: "fit", border: "10px solid #faf7f7" }}
                                />
                                <IconButton
                                    sx={{ position: "absolute", right: 0, bottom: "12px", zIndex: 50 }}
                                    className={classes.button}
                                    color="primary"
                                >
                                    <label
                                        htmlFor="profilePhoto"
                                        style={{
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <CameraAltIcon />
                                    </label>
                                </IconButton>
                                <input
                                    accept="image/*"
                                    id="profilePhoto"
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </Box>
                            {file && (
                                <IconButton
                                    aria-label="Crop"
                                    color="primary"
                                    onClick={() => setOpenCrop(true)}
                                >
                                    <Crop />
                                </IconButton>
                            )}
                        </Box>
                    </DialogContent>
                </Box>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={2}>
                        <Grid item lg={2} md={2} sm={2} xs={12} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                            <H4>Thông tin cơ bản</H4>
                        </Grid>
                        <Grid item lg={10} md={10} sm={10} xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="firstName"
                                        label="Họ"
                                        onChange={handleChange}
                                        value={state.firstName || ""}
                                        validators={["required"]}
                                        errorMessages={["This field is required"]}
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="lastName"
                                        label="Tên"
                                        onChange={handleChange}
                                        value={state.lastName || ""}
                                        validators={["required"]}
                                        errorMessages={["This field is required"]}
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="phoneNum"
                                        label="Điện thoại"
                                        onChange={handleChange}
                                        value={state.phoneNum || ""}
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={12} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                            <H4>Thông tin tài khoản</H4>
                        </Grid>
                        <Grid item lg={10} md={10} sm={10} xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="username"
                                        label="Tên tài khoản"
                                        onChange={handleChange}
                                        value={state.username || ""}
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="email"
                                        type="email"
                                        label="Email"
                                        onChange={handleChange}
                                        value={state.email || ""}
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                                <FormControl sx={{ margin: "8px" }}>
                                    <TextField
                                        name="password"
                                        type="password"
                                        label="Mật khẩu"
                                        onChange={handleChange}
                                        value={state.password || ""}
                                        /* validators={["required"]}
                                        errorMessages={["This field is required"]} */
                                        disabled={state.status === 0 ? true : false}
                                        size="small"
                                    />
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item lg={2} md={2} sm={2} xs={12} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                            <H4>Giới tính</H4>
                        </Grid>
                        <Grid item lg={10} md={10} sm={10} xs={12} sx={{ mt: 2 }}>
                            <FormControl>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="gender"
                                    defaultValue="male"
                                    value={state.gender || "male"}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="male" control={<Radio />} label="Nam" />
                                    <FormControlLabel value="female" control={<Radio />} label="Nữ" />
                                    <FormControlLabel value="other" control={<Radio />} label="Khác" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        {
                            id && (
                                <>
                                    <Grid item lg={2} md={2} sm={2} xs={12} sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                                        <H4>Tình trạng</H4>
                                    </Grid>
                                    <Grid item lg={10} md={10} sm={10} xs={12} sx={{ mt: 2 }}>
                                        <FormControl>
                                            <RadioGroup
                                                row
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="status"
                                                defaultValue={1}
                                                value={state.status || 1}
                                                onChange={handleChange}
                                            >
                                                <FormControlLabel value={2} control={<Radio />} label="Tạm đình chỉ" />
                                                <FormControlLabel value={1} control={<Radio />} label="Bình thường" />
                                                <FormControlLabel value={0} control={<Radio />} label="Tạm xóa" />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            sx={{ my: 2 }}
                        >
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>{id ? "Cập nhật" : "Thêm mới"}</Span>
                        </LoadingButton>
                        {
                            state.status === 0 &&
                            <LoadingButton
                                type="button"
                                color="warning"
                                loading={loading}
                                variant="contained"
                                sx={{ my: 2 }}
                                onClick={handleRecover}
                            >
                                <Icon>restore</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Khôi phục</Span>
                            </LoadingButton>
                        }
                    </Box>
                </ValidatorForm>
                {
                    openCrop && (
                        <CropEasy
                            {...{ photoURL, setOpenCrop, setPhotoURL, setFile }}
                            open={openCrop} handleClose={() => setOpenCrop(false)}
                        />
                    )
                }
            </SimpleCard>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>

    );
};

export default InputForm;
