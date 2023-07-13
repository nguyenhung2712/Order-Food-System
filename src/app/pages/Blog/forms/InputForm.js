/* import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider"; */
import { useEffect, useState, useRef } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    FormControl, FormControlLabel, InputLabel,
    Grid, Backdrop, CircularProgress, Icon, Chip, styled,
    Switch, Select, MenuItem, Box, useTheme
} from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { Editor } from '@tinymce/tinymce-react';

import Swal from 'sweetalert2';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

import { SimpleCard } from "../../../components";
import { Span } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import BlogService from "../../../services/blog.service";
import UserService from "../../../services/user.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/BlogActions";

import { H2 } from "../../../components/Typography";
import { deepObjectEqual } from "../../../utils/utils";
import { addDocument } from '../../../services/firebase/service';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const InputForm = ({ id }) => {
    const editorRef = useRef(null);

    const { palette } = useTheme();
    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({});
    const [flagState, setFlagState] = useState({});
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const isBlocking = () => {
        return !deepObjectEqual(state, flagState) && !isSuccess;
    }
    usePrompt('Thay đổi của bạn sẽ không được lưu. Đồng ý chuyển trang?', isBlocking());

    useEffect(() => {
        (async () => {
            await UserService.getAllUsers()
                .then(res => {
                    setUsers(res.data.payload);
                })
                .catch((err) => {
                    console.log(err);
                });
            if (id) {
                await BlogService.getBlogById(id)
                    .then((res) => {
                        let blog = res.data.payload;
                        setFlagState(blog);
                        setState(blog);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })()
    }, []);
    const handleSubmit = async (event) => {

        let { user, ...tempState } = state;
        if (!tempState.userId) {
            setState({ ...state, userId: users[0].id });
            tempState.userId = users[0].id;
        }
        editorRef.current.uploadImages();

        let content = editorRef.current.getContent();
        tempState.content = content;

        try {
            setLoading(true);
            if (id) {
                await BlogService.updateBlog(id, tempState)
                    .then(async (res) => {
                        await addDocument("notifications", {
                            title: "Cập nhật blog",
                            message: `Một trong các blog của bạn đã được cập nhật thông tin. Hãy liên hệ nhân viên để biết thêm chi tiết.`,
                            usePath: "/my-account/blogs",
                            staffPath: null,
                            readBy: [],
                            image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                            receivedId: [tempState.userId],
                            status: 1
                        });
                    });
                dispatch(update(id, state));
            } else {
                await BlogService.createBlog(tempState)
                    .then(async (res) => {
                        await addDocument("notifications", {
                            title: "Thêm mới blog",
                            message: `Một blog mới đã được thêm cho tài khoản của bạn. Hãy liên hệ nhân viên để biết thêm chi tiết.`,
                            usePath: "/my-account/blogs",
                            staffPath: null,
                            readBy: [],
                            image: "https://res.cloudinary.com/duijwi8od/image/upload/v1685216331/blogging_1.png",
                            receivedId: [tempState.userId],
                            status: 1
                        });
                    });
                dispatch(create(state));
            }
            setLoading(false);
            setIsSuccess(true);
            Swal.fire({
                title: `${id ? "Cập nhật" : "Tạo mới"} thành công`,
                text: "Đồng ý chuyển đến trang quản lý ?",
                icon: 'success',
                showCancelButton: true,
                confirmButtonColor: primaryColor,
                cancelButtonColor: errorColor,
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy'
            })
                .then(result => {
                    if (result.isConfirmed) {
                        navigate("/blog/manage");
                    }
                });
        } catch (err) {
            setIsSuccess(false);
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleStatusChange = (event) => {
        setState({ ...state, status: state.status === 1 ? 0 : 1 });
    }

    const handleEditorChange = (event) => {
        setState({ ...state, content: editorRef.current.getContent() });
    }

    const handleRecover = (event) => {
        Swal.fire({
            title: 'Khôi phục blog',
            text: "Xác nhận khôi phục blog này ?",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: primaryColor,
            cancelButtonColor: errorColor,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy'
        })
            .then(result => {
                if (result.isConfirmed) {
                    setLoading(true);
                    setState({ ...state, status: 1 });
                    BlogService.recoverBlog(id)
                        .then(res => {
                            setLoading(false);
                            toast.success('Đã khôi phục blog thành công', {
                                position: "top-right",
                                autoClose: 2500,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: false,
                                progress: undefined,
                                theme: "light",
                            });
                            dispatch(recover(id));
                        });
                } else {

                }
            });
    }

    return (
        <div style={{ position: "relative" }}>
            {
                state.status === 2 &&
                <Box sx={{
                    position: "absolute",
                    right: "12px",
                    top: "12px"
                }}>
                    <Chip label="Đã xử lý vi phạm" variant="outlined" size="medium"
                        color="warning"
                    />
                </Box>
            }

            <SimpleCard title={!id ? "Thêm blog" : (state.status === 0) ? "Chỉnh sửa blog (Đã tạm xóa)" : "Chỉnh sửa blog"}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                multiline
                                rows={4}
                                name="header"
                                label="Tựa đề"
                                onChange={handleChange}
                                value={state.header || ""}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                                disabled={(state.status === 0 || state.status === 2) ? true : false}
                            />
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <FormControl
                                sx={{ width: '100%', marginBottom: 2 }}
                            >
                                <InputLabel id="demo-select-small">Người viết</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="userId"
                                    value={state.userId || ""}
                                    label="Người viết"
                                    onChange={handleChange}
                                    disabled={state.status === 0 || state.status === 2 || id}
                                >
                                    <MenuItem
                                        value=""
                                        disabled
                                    >Người viết</MenuItem>
                                    {
                                        users && users.map((user, index) =>
                                            <MenuItem
                                                key={index}
                                                value={user.id}
                                            >{user.firstName + " " + user.lastName}</MenuItem>
                                        )
                                    }
                                </Select>
                            </FormControl>
                            {
                                id &&
                                <Box>
                                    <InputLabel>Trạng thái</InputLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={state.status === 1 ? true : false}
                                                onChange={handleStatusChange}
                                                name="status"
                                            />
                                        }
                                        label={state.status === 1 ? "Bình thường" : "Tạm ẩn"}
                                        disabled={(state.status === 0 || state.status === 2) ? true : false}
                                    />
                                </Box>
                            }
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <H2 id="demo-editor">Nội dung</H2>
                            <Editor
                                onInit={(evt, editor) => editorRef.current = editor}
                                value={id && state.content}
                                init={{
                                    height: 500,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'anchor', 'autolink', 'help', 'image', 'code', 'link', 'lists',
                                        'searchreplace', 'table', 'wordcount',
                                    ],
                                    toolbar: 'undo redo | blocks fontfamily fontsize | ' +
                                        'bold italic underline strikethrough | image link | ' +
                                        'mergetags | addcomment showcomments | spellcheckdialog ' +
                                        'a11ycheck typography | align lineheight | checklist numlist ' +
                                        'bullist indent outdent | emoticons charmap | removeformat',
                                    file_picker_types: 'image media',
                                    image_title: true,
                                    automatic_uploads: false,
                                    file_picker_callback: function (cb, value, meta) {
                                        var input = document.createElement('input');
                                        input.setAttribute('type', 'file');
                                        input.setAttribute('accept', 'image/*');

                                        input.onchange = function () {
                                            var file = this.files[0];

                                            var reader = new FileReader();
                                            reader.onload = function () {
                                                var id = 'blobid' + (new Date()).getTime();
                                                var blobCache = editorRef.current.editorUpload.blobCache;
                                                var base64 = reader.result.split(',')[1];
                                                var blobInfo = blobCache.create(id, file, base64);
                                                blobCache.add(blobInfo);

                                                cb(blobInfo.blobUri(), { title: file.name });
                                            };
                                            reader.readAsDataURL(file);
                                        };

                                        input.click();
                                    },
                                    images_upload_url: 'http://localhost:5000/api/blog/upload-image',
                                    content_style: 'body { font-family:Tahoma,Arial,sans-serif; font-size:14px }',
                                    branding: false
                                }}
                                onEditorChange={handleEditorChange}
                                disabled={state.status === 0 || state.status === 2}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            sx={{ my: 2 }}
                            disabled={loading || (state.status === 2 || state.status === 0)}
                        >
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>{id ? "Cập nhật" : "Thêm mới"}</Span>
                        </LoadingButton>
                        {
                            (state.status === 0 || state.status === 2) &&
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
            </SimpleCard>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default InputForm;
