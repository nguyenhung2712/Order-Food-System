import { useEffect, useState } from "react";
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    Box, styled, IconButton, Divider, Button,
    Table, TableBody, TableCell, TableContainer, TableRow, TableHead,
    Radio, RadioGroup, FormControlLabel, FormControl, Autocomplete, Grid,
    Alert
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import swal from 'sweetalert';

import { SimpleCard } from "../../../components";
import { H4, H5, Paragraph, Span } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import ProductService from "../../../services/product.service";
import UserService from "../../../services/user.service";
import OrderService from "../../../services/order.service";
import DetailService from "../../../services/detail.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/ProductActions";
import { withStyles } from '@mui/styles';
import { deepObjectEqual, convertToVND } from "../../../utils/utils";
/* import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
 */import 'dayjs/locale/vi';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { nanoid } from 'nanoid';
import RefreshIcon from '@mui/icons-material/Refresh';

const IconButtonTopImage = styled(IconButton)(() => ({
    position: "absolute",
    zIndex: 9999,
    top: 0,
    right: 0
}));

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    '& .MuiInputBase-root.Mui-disabled': {
        backgroundColor: '#f0f0f0',
    },
}));

const StyledTableHead = withStyles(theme => ({
    root: {
        backgroundColor: '#FAFAFA'
    }
}))(TableHead);

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    height: 44,
    whiteSpace: 'pre',
    overflow: 'hidden',
    color: theme.palette.text.primary,
    margin: "0 !important",
    '&:hover': { background: 'rgba(0, 0, 0, 0.08)' },
    '& .icon': {
        width: 50,
        fontSize: '18px',
        paddingLeft: '16px',
        paddingRight: '16px',
        verticalAlign: 'middle',
    },
}));

const defaultDetail = {
    product: { name: "", id: "", price: "" },
    quantity: ""
};

const InputForm = ({ id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({});
    const [details, setDetails] = useState([]);
    const [flagState, setFlagState] = useState({});
    const [formData, setFormData] = useState();
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [fileArr, setFileArr] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isEmpty, setEmpty] = useState(false);

    /* const isBlocking = () => {
        return !deepObjectEqual(state, flagState) && !isSuccess;
    }
    usePrompt('Thay đổi của bạn sẽ không được lưu. Đồng ý chuyển trang?', isBlocking()); */

    useEffect(() => {
        setState({
            ...state,
            number: handleGenerateNumber()
        });
        (async () => {
            await UserService.getAllUsers()
                .then(res => {
                    let users = res.data.payload;
                    let labelUsers = users.filter(user => user.status !== 0).map(user => ({
                        label: user.firstName + " " + user.lastName,
                        addresses: user.UserAddresses,
                        id: user.id,
                        email: user.email,
                        phone: user.phoneNum
                    }));
                    setUsers(labelUsers);
                })
                .catch((err) => {
                    console.log(err);
                });
            await ProductService.getAllProducts()
                .then(res => {
                    let products = res.data.payload;
                    let labelProducts = products.filter(product => product.status !== 0).map(product => ({
                        label: product.dishName,
                        id: product.id,
                        price: product.price
                    }));
                    setProducts(labelProducts);
                })
                .catch((err) => {
                    console.log(err);
                });
        })()
    }, []);

    const handleSubmit = async (event) => {
        setLoading(true);
        if (details.length === 0 || !state.user || !state.address) {
            setEmpty(true);
            setLoading(false);
            return;
        }
        try {
            let paymentTotal = details.reduce((acc, detail) => acc + Number(detail.product.price) * detail.quantity, 0);
            await OrderService.createOrder({
                payment: { paymentTotal },
                addressId: state.address.address.id,
                userId: state.user.id,
                email: state.user.email,
                predictDate: new Date(),
                number: state.number,
                note: '',
            })
                .then((res) => {
                    details.forEach(async (detail) => {
                        await DetailService.createDetail({
                            orderId: res.data.payload.id,
                            dishId: detail.product.id,
                            price: Number(detail.product.price),
                            quantity: detail.quantity,
                        })
                    });
                });
            setIsSuccess(true);
            swal({
                title: "Tạo mới thành công",
                text: "Đồng ý chuyển đến trang quản lý ?",
                icon: "success",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then(result => {
                    if (result) {
                        navigate("/order/manage");
                    } else {
                        setLoading(false);
                    }
                });
        } catch (error) {
            setIsSuccess(false);
            setLoading(false);
        }
    };


    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleGenerateNumber = () => {
        const date = new Date();
        let dateId =
            date.getFullYear() +
            '' +
            (date.getMonth() + 1 < 10
                ? '0' + (date.getMonth() + 1)
                : date.getMonth() + 1) +
            '' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
        return dateId + nanoid(4).toUpperCase();
    }
    return (
        <div>
            <SimpleCard
                title={"Viết hóa đơn"}
                sx={{ position: "relative" }}
            >
                <ValidatorForm onSubmit={() => { }} onError={() => null}>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", position: "absolute", top: 0, right: 16 }}>
                        <Button
                            component="label"
                            color="primary"
                            sx={{ my: 2, mx: 2 }}
                            onClick={() => navigate(-1)}
                        >
                            Hủy
                        </Button>
                        <LoadingButton
                            variant="contained"
                            component="label"
                            color="primary"
                            sx={{ my: 2 }}
                            onClick={handleSubmit}
                            loading={loading}
                        >
                            Xác nhận
                        </LoadingButton>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        {/* <IconButton
                    sx={{ height: "40px" }}
                    onClick={() => navigate("/order/manage")}
                >
                    <ArrowBackIcon />
                </IconButton>
                <ReactToPrint
                    trigger={() => <Button
                        variant="contained"
                        component="label"
                        color="primary"
                        sx={{ my: 2 }}
                    >
                        <PrintIcon />
                    </Button>}
                    content={() => printRef.current}
                /> */}
                    </Box >
                    <Box sx={{ padding: "12px " }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "8px"
                            }}
                        >
                            <Box>
                                <H4 sx={{ marginBottom: "8px" }}>Thông tin đơn hàng</H4>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <TextField
                                        type="text"
                                        name="number"
                                        value={state.number || ""}
                                        errorMessages={["This field is required"]}
                                        label="Mã đơn"
                                        validators={["required", "minStringLength: 0"]}
                                        disabled
                                    />
                                    <StyledIconButton
                                        variant="contained"
                                        component="label"
                                        color="primary"
                                        sx={{ my: 2, width: "44px" }}
                                        onClick={() => setState({ ...state, number: handleGenerateNumber() })}
                                    >
                                        <RefreshIcon />
                                    </StyledIconButton>
                                </Box>
                            </Box>
                        </Box>
                        <Divider />
                        <Box>
                            <H4
                                sx={{
                                    "marginTop": "0px",
                                    "fontWeight": "500",
                                    "lineHeight": "1.5",
                                    "textTransform": "none",
                                    "fontSize": "15px",
                                    "marginBottom": "8px"
                                }}
                            >Thông tin giao hàng</H4>
                            <Grid container spacing={2}>
                                <Grid item lg={5} md={5} sm={5} xs={5} sx={{ height: "fit-content" }}>
                                    <Autocomplete
                                        disablePortal
                                        options={users}
                                        sx={{ minWidth: "fit-content", my: 1 }}
                                        onChange={(event, newValue) => setState({ ...state, user: newValue })}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} key={option.id}>
                                                    {option.label}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Khách hàng" size="small" />}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        options={
                                            state.user && users.filter(user => user.id === state.user.id)[0].addresses[0].title
                                                ? users.filter(user => user.id === state.user.id)[0].addresses
                                                : []
                                        }
                                        sx={{ minWidth: "fit-content", my: 1 }}
                                        onChange={(event, newValue) => setState({ ...state, address: newValue })}
                                        getOptionLabel={(option) => option.title || ""}
                                        renderOption={(props, option) => {
                                            return (
                                                <li {...props} /* key={option.address.addressId + option.address.userId} */>
                                                    {option.title}
                                                </li>
                                            );
                                        }}
                                        renderInput={(params) =>
                                            <TextField {...params} label="Địa chỉ" size="small" />
                                        }
                                    />
                                </Grid>
                            </Grid>
                            {state.user && <Paragraph>{state.user.email}</Paragraph>}
                            {
                                state.address &&
                                <Paragraph>
                                    {
                                        state.address.address.address + ", " + state.address.address.ward.wardName + " - " +
                                        state.address.address.district.districtName + ", " + state.address.address.province.provinceName
                                    }
                                </Paragraph>
                            }
                            {(state.user && state.user.phone && state.user.phone !== "") && <Paragraph>+84{state.user.phone.slice(1)}</Paragraph>}
                        </Box>
                    </Box>
                    <TableContainer sx={{ marginTop: "16px" }}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                            <StyledTableHead>
                                <TableRow>
                                    <TableCell align="left" sx={{
                                        paddingLeft: "24px !important"
                                    }}>#</TableCell>
                                    <TableCell align="center">Tên</TableCell>
                                    <TableCell align="center">Giá</TableCell>
                                    <TableCell align="center">Số lượng</TableCell>
                                    <TableCell align="center">Tổng</TableCell>
                                    <TableCell align="center">Tùy chọn</TableCell>
                                </TableRow>
                            </StyledTableHead>
                            <TableBody>
                                {details.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align="left" sx={{
                                            paddingLeft: "24px !important"
                                        }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Autocomplete
                                                disablePortal
                                                options={products}
                                                sx={{ minWidth: "fit-content" }}
                                                onChange={(event, newValue) => {
                                                    setDetails([...details].map((object, i) => {
                                                        if (i === index) {
                                                            return {
                                                                ...object,
                                                                product: newValue
                                                            }
                                                        }
                                                        else return object;
                                                    }));
                                                }}
                                                renderInput={(params) =>
                                                    <TextField {...params} label="Tên" size="small" />
                                                }
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="text"
                                                name="price"
                                                value={convertToVND(Number(row.product.price)) || ""}
                                                errorMessages={["This field is required"]}
                                                label="Giá"
                                                validators={["required", "minStringLength: 0"]}
                                                size="small"
                                                disabled
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <TextField
                                                type="number"
                                                name="quantity"
                                                value={row.quantity || ""}
                                                onChange={(event) => {
                                                    setDetails([...details].map((object, i) => {
                                                        if (i === index) {
                                                            return {
                                                                ...object,
                                                                quantity: event.target.value
                                                            }
                                                        }
                                                        else return object;
                                                    }));
                                                }}
                                                errorMessages={["This field is required"]}
                                                label="Số lượng"
                                                validators={["required", "minStringLength: 0"]}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            {
                                                row.product.price === "" || row.quantity === ""
                                                    ? convertToVND(0)
                                                    : convertToVND(Number(row.product.price) * row.quantity)
                                            }
                                        </TableCell>
                                        <TableCell align="center">
                                            <StyledIconButton
                                                variant="contained"
                                                component="label"
                                                color="primary"
                                                sx={{ my: 2 }}
                                                onClick={() => {
                                                    setDetails(prev => prev.filter((item, i) => i !== index));
                                                }}
                                            >
                                                <DeleteIcon />
                                            </StyledIconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            variant="contained"
                            component="label"
                            color="primary"
                            sx={{ my: 2 }}
                            onClick={() => setDetails([...details, defaultDetail])}
                        >
                            Thêm
                        </Button>
                    </Box>
                    <Box sx={{ "padding": "8px 16px", "maxWidth": "300px", "marginLeft": "auto" }}>
                        <Box sx={{ "display": "flex", "WebkitBoxAlign": "center", "alignItems": "center", "WebkitBoxPack": "justify", "justifyContent": "space-between" }}>
                            {/* <H5 sx={{ "marginBottom": "0px", "marginTop": "0px", "fontSize": "14px", "fontWeight": "500", "lineHeight": "1.5", "textTransform": "none" }}>Tổng:</H5>
                                <H5 sx={{ "marginBottom": "0px", "marginTop": "0px", "fontSize": "14px", "fontWeight": "500", "lineHeight": "1.5", "textTransform": "none" }}>
                                    {convertToVND(state.details.reduce((acc, detail) => acc + detail.quantity * Number(detail.price), 0))}
                                </H5> */}
                        </Box>
                    </Box>
                </ValidatorForm>
                {isEmpty && <Alert severity="error">This is an error alert — check it out!</Alert>}
            </SimpleCard>
        </div >
    );
};

export default InputForm;
