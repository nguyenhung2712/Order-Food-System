/* import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider"; */
import { useEffect, useState, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
  FormControl,
  FormControlLabel, InputLabel,
  Grid,
  Icon, IconButton,
  styled,
  Switch, Select,
  MenuItem,
  Box
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

import { H2 } from "../../../components/Typography";
import { deepObjectEqual } from "../../../utils/utils"; 

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const InputForm = ({ id }) => {
    const editorRef = useRef(null);

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
        setLoading(true);
        let { user, ...tempState } = state;
        if (!tempState.userId) {
            setState({ ...state, userId: users[0].id });
            tempState.userId = users[0].id;
        }
        editorRef.current.uploadImages();

        let content = editorRef.current.getContent();
        if (!content) {
            //in ra màn hình validate
        }
        
        try {
            if (id) {
                await BlogService.updateBlog(id, tempState);
                dispatch(update(id, state));
            } else {
                await BlogService.createBlog(tempState)
                    .then(res => {
                        console.log(res);
                    });
                dispatch(create(state));
            }
            setIsSuccess(true);
            swal({
                title: `${ id ? "Cập nhật" : "Tạo mới" } thành công`,
                text: "Đồng ý chuyển đến trang quản lý ?",
                icon: "success",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then(result => {
                    if (result) {
                        navigate("/blog/manage");
                    } else {
                        setLoading(false);
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
        setState({ ...state, status: state.status === 1 ? 2 : 1 });
    }

    const handleEditorChange = (event) => {
        setState({ ...state, content: editorRef.current.getContent() });
    }

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
    console.log(state);
    return (
        <div>
            <SimpleCard title={ !id ? "Thêm blog" : state.status === 0 ? "Chỉnh sửa blog (Đã tạm xóa)" : "Chỉnh sửa sản phẩm" }>
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
                                disabled={state.status === 0 ? true : false}
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
                                    disabled={state.status === 0 ? true : false}
                                >
                                    <MenuItem 
                                        value=""
                                        disabled
                                    >Chọn loại</MenuItem>
                                    { 
                                        users && users.map((user, index) => 
                                            <MenuItem 
                                                key={ index }
                                                value={ user.id }
                                            >{ user.firstName + " " + user.lastName }</MenuItem>
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
                                        label={ state.status === 1 ? "Bình thường" : "Tạm ẩn" }
                                        disabled={state.status === 0 ? true : false}
                                    />
                                </Box>
                            }
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <H2 id="demo-editor">Nội dung</H2>
                            <Editor
                                onInit={(evt, editor) => editorRef.current = editor}
                                initialValue={ id ? state.content : "" }
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
                                                var blobCache =  editorRef.current.editorUpload.blobCache;
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
                        > 
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>{ id ? "Cập nhật" : "Thêm mới" }</Span>
                        </LoadingButton>
                        {
                            state.status === 0 &&
                                <LoadingButton
                                    type="button"
                                    color="warning"
                                    loading={loading}
                                    variant="contained"
                                    sx={{ my: 2 }}
                                    onClick={ handleRecover }
                                > 
                                    <Icon>restore</Icon>
                                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Khôi phục</Span>
                                </LoadingButton>
                        }
                    </Box>
                </ValidatorForm>
            </SimpleCard>
            
        </div>
    );
};

export default InputForm;
