/* import { DatePicker } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider"; */
import { useEffect, useState } from "react";
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
  Box, ImageList, ImageListItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import swal from 'sweetalert';

import { SimpleCard } from "../../../components";
import { Span } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import ProductService from "../../../services/product.service";
import ProductTypeService from "../../../services/ptype.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/ProductActions";

import { deepObjectEqual } from "../../../utils/utils";


const IconButtonTopImage = styled(IconButton)(() => ({
    position: "absolute",
    zIndex: 9999,
    top: 0,
    right: 0
}));

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const InputForm = ({ id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({});
    const [flagState, setFlagState] = useState({});
    const [formData, setFormData] = useState();
    const [types, setTypes] = useState([]);
    const [fileArr, setFileArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const isBlocking = () => {
        return !deepObjectEqual(state, flagState) && !isSuccess;
    }
    usePrompt('Thay đổi của bạn sẽ không được lưu. Đồng ý chuyển trang?', isBlocking());

    useEffect(() => {
        (async () => {
            await ProductTypeService.getAllProductTypes()
                .then(res => {
                    setTypes(res.data.payload);
                })
                .catch((err) => {
                    console.log(err);
                });
            if (id) {
                await ProductService.getProductById(id)
                    .then((res) => {
                        let product = res.data.payload;
                        let productImage = product.image.split('|').filter(image => image !== '');
                        if (fileArr.length === 0) {
                            productImage.forEach(image => {
                                setFileArr(curr => [...curr, image]);
                            })
                        }
                        setFlagState(res.data.payload);
                        setState(res.data.payload);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        })()
    }, []);

    const handleSubmit = async (event) => {
        setLoading(true);
        let { type, ...tempState } = state;
        try {
            if (id) {
                await ProductService.updateProduct(id, tempState)
                    .then(res => {
                        if (formData) {
                            ProductService.uploadImage(id, formData);
                        }
                        dispatch(update(id, state));
                    });
            } else {
                await ProductService.createProduct(tempState)
                    .then(res => {
                        if (formData) {
                            ProductService.uploadImage(res.data.payload.id, formData);
                        }
                        dispatch(create(state));
                    });
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
                        navigate("/product/manage");
                    } else {
                        setLoading(false)
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
    
    const handleDeleteImage = (url) => {
        if (id) {
            setState({ ...state, 
                image: state.image.split("|")
                    .filter(image => (image !== "") && (image !== url))
                    .reduce((acc, image) => {
                        return acc + "|" + image;
                    }, "")
            });
        }
        setFileArr(curr => curr.filter(imageUrl => imageUrl !== url));
    }

    const uploadMultipleFiles = (event) => {
        let uploadData = new FormData();
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            uploadData.append("files", event.target.files[i]);
            setFileArr(curr => [...curr, URL.createObjectURL(files[i])]);
        }
        setFormData(uploadData);
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
                    ProductService.recoverProduct(id)
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
        <div>
            <SimpleCard title={ !id ? "Thêm sản phẩm" : state.status === 0 ? "Chỉnh sửa sản phẩm (Đã tạm xóa)" : "Chỉnh sửa sản phẩm" }>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={8} sx={{ mt: 2 }}>
                                    <TextField
                                        type="text"
                                        name="dishName"
                                        id="standard-basic"
                                        value={state.dishName || ""}
                                        onChange={handleChange}
                                        errorMessages={["This field is required"]}
                                        label="Tên món"
                                        validators={["required", "minStringLength: 0"]}
                                        disabled={state.status === 0 ? true : false}
                                    />
                                </Grid>
                                <Grid item lg={4} md={4} sm={4} xs={4} sx={{ mt: 2 }}>
                                    <FormControl 
                                        sx={{ width: '100%', marginBottom: 2 }} 
                                    >
                                        <InputLabel id="demo-select-small">Loại sản phẩm</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name="typeId"
                                                value={state.typeId || ""}
                                                label="Loại sản phẩm"
                                                onChange={handleChange}
                                                disabled={state.status === 0 ? true : false}
                                            >
                                                <MenuItem 
                                                    value=""
                                                    disabled
                                                >Chọn loại</MenuItem>
                                                { 
                                                    types && types.map((type, index) => 
                                                        <MenuItem 
                                                            key={ index }
                                                            value={ type.id }
                                                        >{ type.typeName }</MenuItem>
                                                    )
                                                }
                                            </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <TextField
                                type="number"
                                name="price"
                                label="Giá bán"
                                onChange={handleChange}
                                value={state.price || ""}
                                errorMessages={["This field is required"]}
                                validators={["required", "minStringLength:1", "maxStringLength: 9"]}
                                disabled={state.status === 0 ? true : false}
                            />
                            <TextField
                                multiline
                                rows={4}
                                name="ingredients"
                                label="Danh sách các nguyên liệu"
                                onChange={handleChange}
                                value={state.ingredients || ""}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                                disabled={state.status === 0 ? true : false}
                            />
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

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            
                            <div>
                                <Box 
                                    sx={{ 
                                        width: '100%',
                                        height: 300, 
                                        overflowY: 'scroll', 
                                        position: 'relative',
                                        border: 3,
                                    }}
                                >
                                    <ImageList variant="masonry" cols={3} gap={8}>
                                        {(fileArr || []).map((url, index) => (
                                            <ImageListItem key={index}>
                                                <img
                                                    src={`${url}?w=248&fit=crop&auto=format`}
                                                    srcSet={`${url}`}
                                                    alt={url}
                                                    loading="lazy"
                                                />
                                                <IconButtonTopImage 
                                                    aria-label="delete" 
                                                    color="error"
                                                    onClick={() => handleDeleteImage(url)}
                                                    disabled={state.status === 0 ? true : false}
                                                >
                                                    <DeleteIcon 
                                                        color="error"
                                                    />
                                                </IconButtonTopImage>
                                            </ImageListItem>
                                        ))}
                                    </ImageList>
                                </Box>
                                <TextField
                                    type="file"
                                    onChange={(event) => uploadMultipleFiles(event)} 
                                    /* validators={["required", "isEmail"]}
                                    errorMessages={["this field is required", "email is not valid"]} */
                                    inputProps={{
                                        multiple: true
                                    }}
                                    disabled={state.status === 0 ? true : false}
                                />
                            </div>
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
