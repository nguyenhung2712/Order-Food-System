import { useEffect, useState } from "react";
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    FormControl, FormControlLabel, InputLabel,
    Grid, Icon, IconButton,
    styled, useTheme, Switch, Select,
    MenuItem, Backdrop, CircularProgress,
    Box, ImageList, ImageListItem
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import { useDropzone } from 'react-dropzone';

import { SimpleCard } from "../../../components";
import { Span, H3 } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import ProductService from "../../../services/product.service";
import ToppingService from "../../../services/topping.service";
import ProductTypeService from "../../../services/ptype.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/ProductActions";

import { deepObjectEqual, not, sweetAlert, toastify } from "../../../utils/utils";
import { DragDropContext } from 'react-beautiful-dnd'
import Column from "../dnd-items/Column";

const IconButtonTopImage = styled(IconButton)(() => ({
    position: "absolute",
    zIndex: 1000,
    top: 0,
    right: 0
}));

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const MAX_FILE_ACCEPT = 10;

const InputForm = ({ id }) => {

    const { palette } = useTheme();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const errorColor = palette.error.main;
    const primaryColor = palette.primary.main;

    const [tppArr, setTppArr] = useState([]);
    const [initCurTppArr, setInitCurTppArr] = useState([]);

    const [columns, setColumns] = useState()
    const [state, setState] = useState({});
    const [flagState, setFlagState] = useState({});
    const [formData, setFormData] = useState();
    const [types, setTypes] = useState([]);
    const [fileArr, setFileArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [filterText, setFilterText] = useState('');

    const onDrop = useCallback(acceptedFiles => {
        if (fileArr.length + acceptedFiles.length > MAX_FILE_ACCEPT) {
            toastify({
                message: "Ảnh vượt giới hạn số lượng: 10",
                type: "error",
                position: "top-right"
            })
            return;
        }

        let uploadData = new FormData();
        for (let i = 0; i < acceptedFiles.length; i++) {
            uploadData.append("files", acceptedFiles[i]);
            setFileArr(curr => [...curr, { url: URL.createObjectURL(acceptedFiles[i]), file: acceptedFiles[i] }]);
        }
        setFormData(uploadData);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: state.status === 0 })

    const isBlocking = () => !deepObjectEqual(state, flagState) && !isSuccess;
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
                        let currentArr = product.DishToppings.map((topping, index) =>
                            ({ id: topping.tppId, name: topping.topping.tppName }));
                        if (fileArr.length === 0) {
                            productImage.forEach(image => {
                                setFileArr(curr => [...curr, { url: image }]);
                            })
                        }
                        setInitCurTppArr(currentArr);
                        setFlagState(res.data.payload);
                        setState(res.data.payload);

                        ToppingService.getAllToppings()
                            .then(res => {
                                let tppArr = res.data.payload.map((topping, index) =>
                                    ({ id: topping.id, name: topping.tppName }));
                                let inSystemArr = tppArr.filter(tpp => !currentArr.map(topping => topping.id).includes(tpp.id));
                                setTppArr(inSystemArr);

                                setColumns({
                                    "in-system": {
                                        id: 'in-system',
                                        name: "Trong hệ thống",
                                        list: [...inSystemArr]
                                    },
                                    current: {
                                        id: 'current',
                                        name: "Hiện tại",
                                        list: [...currentArr]
                                    }
                                })
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            } else {
                await ToppingService.getAllToppings()
                    .then(res => {
                        let tppArr = res.data.payload.map((topping, index) =>
                            ({ id: topping.id, name: topping.tppName }));
                        setTppArr(tppArr);
                        setColumns({
                            "in-system": {
                                id: 'in-system',
                                name: "Trong hệ thống",
                                list: tppArr
                            },
                            current: {
                                id: 'current',
                                name: "Hiện tại",
                                list: []
                            }
                        })
                    })
            }
        })();
    }, []);

    useEffect(() => {
        if (filterText === "") {
            setColumns(prev => ({
                ...prev,
                "in-system": {
                    id: 'in-system',
                    name: "Trong hệ thống",
                    list: tppArr
                }
            }));
        } else {
            setColumns(prev => ({
                ...prev,
                "in-system": {
                    id: 'in-system',
                    name: "Trong hệ thống",
                    list: tppArr.filter((tpp) => tpp.name.toLowerCase()
                        .indexOf(filterText.toLowerCase()) > -1)
                }
            }));
        }
    }, [filterText]);

    const handleSubmit = async (event) => {
        let { type, ...tempState } = state;
        try {
            setLoading(true);
            if (id) {
                await ProductService.updateProduct(id, tempState)
                    .then(res => {
                        if (formData) {
                            ProductService.uploadImage(id, formData);
                        }
                        let curTppArr = columns["current"].list;
                        let not1 = not(initCurTppArr, curTppArr);
                        let not2 = not(curTppArr, initCurTppArr);
                        if (not1.length !== 0) {
                            not1.forEach(async (tpp) => {
                                await ToppingService.deleteDishTopping(id, tpp.id);
                            })
                        }
                        if (not2.length !== 0) {
                            not2.forEach(async (tpp) => {
                                await ToppingService.createDishTopping(id, tpp.id);
                            })
                        }
                        dispatch(update(id, state));
                    });
            } else {
                await ProductService.createProduct({ ...tempState, status: 1 })
                    .then(res => {
                        if (formData) {
                            ProductService.uploadImage(res.data.payload.id, formData);
                        }
                        if (columns && columns["current"] && columns["current"].list.length > 0) {
                            columns["current"].list.forEach(async (topping) => {
                                await ToppingService.createDishTopping(res.data.payload.id, topping.id);
                            });
                        }
                        dispatch(create(state));
                    });
            }
            setIsSuccess(true);
            setLoading(false);
            sweetAlert({
                title: `${id ? "Cập nhật" : "Tạo mới"} thành công`,
                text: "Đồng ý chuyển đến trang quản lý ?",
                icon: "success",
                cancelColor: errorColor,
                confirmColor: primaryColor,
            })
                .then(result => {
                    if (result.isConfirmed) {
                        navigate("/product/manage");
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

    const handleDeleteImage = (image) => {
        if (formData) {
            let fData = new FormData();
            let values = formData.getAll("images");
            let index = values.indexOf(image.file);
            values.splice(index, 1);
            for (let i = 0; i < values.length; i++) {
                fData.append("images", values[i]);
            }
            setFormData(fData);
        }
        setFileArr(curr => curr.filter(imageUrl => imageUrl.url !== image.url));
        if (id) {
            setState({
                ...state,
                image: state.image.split("|")
                    .filter(imageUrl => (imageUrl !== "") && (imageUrl !== image.url))
                    .reduce((acc, image) => {
                        return acc + "|" + image;
                    }, "")
            });
        }

        /* if (id) {
            
        } */
        /* setFileArr(curr => curr.filter(imageUrl => imageUrl !== url)); */
    }

    const handleRecover = (event) => {
        sweetAlert({
            title: 'Khôi phục sản phẩm',
            text: "Xác nhận xóa các sản phẩm đã chọn ?",
            icon: 'warning',
            cancelColor: errorColor,
            confirmColor: primaryColor,
        })
            .then(result => {
                if (result.isConfirmed) {
                    setLoading(true);
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

    const onDragEnd = ({ source, destination, draggableId }) => {
        if (destination === undefined || destination === null) return null;

        if (source.droppableId === destination.droppableId && destination.index === source.index)
            return null;

        const start = columns[source.droppableId]
        const end = columns[destination.droppableId]

        if (start === end) {
            const newList = start.list.filter((_, idx) => idx !== source.index)
            newList.splice(destination.index, 0, start.list[source.index])
            const newCol = {
                id: start.id,
                list: newList,
                name: start.name
            }
            setColumns(state => ({ ...state, [newCol.id]: newCol }))
            return null;
        } else {
            const newStartList = start.list.filter((_, idx) => idx !== source.index)
            const newStartCol = {
                id: start.id,
                list: newStartList,
                name: start.name
            }

            const newEndList = end.list
            newEndList.splice(destination.index, 0, start.list[source.index])
            const newEndCol = {
                id: end.id,
                list: newEndList,
                name: end.name
            }

            if (newStartCol.id === "in-system") {
                setTppArr(prev => prev.filter((tpp, idx) => tpp.id !== draggableId));
            }
            setColumns(state => ({
                ...state,
                [newStartCol.id]: newStartCol,
                [newEndCol.id]: newEndCol
            }))
            return null;
        }
    }

    return (
        <div>
            <SimpleCard title={!id ? "Thêm món ăn" : state.status === 0 ? "Chỉnh sửa món ăn (Đã tạm xóa)" : "Chỉnh sửa món ăn"}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item lg={8} md={8} sm={8} xs={8}>
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
                                <Grid item lg={4} md={4} sm={4} xs={4}>
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
                                                        key={index}
                                                        value={type.id}
                                                    >{type.typeName}</MenuItem>
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
                            <Grid container spacing={1}>
                                <Grid item lg={id ? 9 : 12} md={id ? 9 : 12} sm={id ? 9 : 12} xs={id ? 9 : 12}>
                                    <TextField
                                        type="number"
                                        name="quantityInDay"
                                        label="Số lượng bán trong ngày"
                                        onChange={handleChange}
                                        value={state.quantityInDay || ""}
                                        errorMessages={["This field is required"]}
                                        validators={["required",/*  "minStringLength:1", "maxStringLength: 9" */]}
                                        disabled={state.status === 0 ? true : false}
                                        InputProps={{ inputProps: { min: 1, max: 500 } }}
                                    />
                                </Grid>
                                {
                                    id &&
                                    <Grid item lg={3} md={3} sm={3} xs={3}>
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
                                            disabled={state.status === 0 ? true : false}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            <DragDropContext onDragEnd={onDragEnd}>
                                <H3>Đồ ăn kèm</H3>
                                <Grid container spacing={1}>
                                    {
                                        columns && Object.values(columns).map(col => (
                                            <Grid key={col.id} item lg={6} md={6} sm={6} xs={12}>
                                                <Column col={col}
                                                    filterText={filterText}
                                                    onSetFilterText={setFilterText}
                                                    isDisabled={state.status === 0}
                                                />
                                            </Grid>
                                        ))
                                    }
                                </Grid>

                            </DragDropContext>
                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>

                            <Box {...getRootProps()} sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "100%",
                                height: "160px",
                                cursor: state.status === 0 ? "default" : "pointer",
                                borderRadius: "4px",
                                marginBottom: "12px",
                                transition: "all 350ms ease-in-out 0s",
                                border: "2px dashed rgba(52, 49, 76, 0.3)",
                                backgroundColor: "rgba(0, 0, 0, 0.01)",
                                '&:hover': {
                                    backgroundColor: state.status === 0 ? "rgba(0, 0, 0, 0.01)" : "rgba(52, 49, 76, 0.2) !important"
                                }
                            }}>
                                <input {...getInputProps()} />
                                <Box>
                                    <p>Thả file tại đây...</p>
                                </Box>
                            </Box>
                            <Box sx={{
                                width: '100%',
                                height: 426,
                                overflow: 'hidden',
                                position: 'relative',
                                border: "1px solid #919AB7",
                                borderRadius: "4px",
                                overflowY: "auto"
                            }}>
                                <ImageList variant="masonry" cols={3} gap={8}>
                                    {(fileArr || []).map((image, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                src={`${image.url}?w=248&fit=crop&auto=format`}
                                                srcSet={`${image.url}`}
                                                alt={image.url}
                                                loading="lazy"
                                            />
                                            <IconButtonTopImage
                                                aria-label="delete"
                                                color="error"
                                                onClick={() => handleDeleteImage(image)}
                                                disabled={state.status === 0 ? true : false}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButtonTopImage>
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <LoadingButton
                            type="submit"
                            color="primary"
                            loading={loading}
                            variant="contained"
                            sx={{ my: 2 }}
                            disabled={state.status === 0}
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
