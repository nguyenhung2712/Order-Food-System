import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import {
    FormControlLabel, InputLabel,
    Grid,
    Icon, 
    styled,
    Switch, 
    Box
} from "@mui/material";
import { LoadingButton } from '@mui/lab';

import swal from 'sweetalert';

import { SimpleCard, TransferList } from "../../../components";
import { Span } from "../../../components/Typography";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

import StaffService from "../../../services/staff.service";
import RoleService from "../../../services/role.service";
import usePrompt from "../../../hooks/usePrompt";
import { create, update, recover } from "../../../redux/actions/StaffActions";

import { deepObjectEqual, not } from "../../../utils/utils"; 

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const InputForm = ({ id }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [state, setState] = useState({});
    const [currentRoles, setCurrentRoles] = useState([]);
    const [tempRoles, setTempRoles] = useState([]);
    const [otherRoles, setOtherRoles] = useState([]);
    const [flagState, setFlagState] = useState({});
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    //Ngiên cứu cách tách status và gộp lại khi status đó thay đổi
    const isBlocking = () => {
        return !deepObjectEqual(state, flagState) && !isSuccess;
    }
    usePrompt('Thay đổi của bạn sẽ không được lưu. Đồng ý chuyển trang?', isBlocking());

    useEffect(() => {
        ValidatorForm.addValidationRule("isPasswordMatch", (value) => {
            if (value !== state.password) return false;
        
            return true;
        });
        return () => ValidatorForm.removeValidationRule("isPasswordMatch");
    }, [state.password]);

    useEffect(() => {
        (async () => {
            
            if (id) {
                await RoleService.getOtherRolesByAdminId(id)
                    .then(res => {
                        setOtherRoles(res.data.payload);
                    });
                await RoleService.getRolesByAdminId(id)
                    .then(res => {
                        let roles = res.data.payload;
                        setTempRoles(roles);
                        setCurrentRoles(roles);
                    });
                await StaffService.getStaffById(id)
                    .then((res) => {
                        let staff = res.data.payload;
                        setFlagState(staff);
                        setState(staff);
                    });
            } else {
                if (otherRoles.length === 0) {
                    await RoleService.getAllRoles()
                        .then(res => {
                            let roles = res.data.payload;
                            setOtherRoles(roles);
                        });
                }
            }
        })()
    }, []);

    const handleSubmit = async (event) => {
        setLoading(true);
        let { cpassword, ...tempState } = state;
        
        try {
            let res, isCreateAdminRole = false;
            let not1 = not(tempRoles, currentRoles);
            let not2 = not(currentRoles, tempRoles);
            if (id) {
                res = await StaffService.updateStaff(id, tempState);
                not1.length === 0
                    ? isCreateAdminRole = true
                    : isCreateAdminRole = false;
                dispatch(update(id, state));
            } else {
                isCreateAdminRole = true;
                res = await StaffService.createStaff(tempState);
                dispatch(create(state));
            }
            let staffId = res.data.payload.id; 
            //Phân quyền staff
            if (isCreateAdminRole) {//Có quyền được phân cho staff
                not2.forEach(async (role) => {
                    await RoleService.createRoleForAdmin(staffId, role.id)
                        .then(res => {
                            console.log(res);
                        });
                })
            } else if (not2.length === 0) {//Có quyền được loại bỏ của staff
                not1.forEach(async (role) => {
                    await RoleService.deleteRoleForAdmin(staffId, role.id)
                        .then(res => {
                            console.log(res);
                        });;
                })
            }
            //Thông báo tình trạng
            let { message, status } = res.data;
            setIsSuccess(true);
            swal({
                title: `${ id ? "Cập nhật" : "Tạo mới" } ${ status === "success" ? "thành công" : "thất bại"}`,
                text: !(status === "success") ? message : "Đồng ý chuyển đến trang quản lý ?" ,
                icon: status === "success" ? "success" : "error",
                buttons: ["Hủy bỏ", "Đồng ý"],
            })
                .then(result => {
                    if (result) {
                        status === "success"
                            ? navigate("/staff/manage")
                            : setLoading(false);
                    } else {
                        setLoading(false);
                    }
                });
        } catch (err) {
            setIsSuccess(false);
            setLoading(false);
            console.log(err);
        }
    };

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.value });
    };

    const handleStatusChange = (event) => {
        setState({ ...state, status: state.status === 1 ? 2 : 1 });
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
                    setState({ ...state, status: 2 });
                    StaffService.recoverStaff(id)
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
            <SimpleCard title={ !id ? "Thêm nhân viên" : [0, 3].includes(state.status) ? "Chỉnh sửa thông tin nhân viên (Đã tạm xóa)" : "Chỉnh sửa nhân viên" }>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={4}>
                        <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                name="username"
                                label="Tên tài khoản"
                                onChange={handleChange}
                                value={state.username || ""}
                                validators={["required"]}
                                errorMessages={["This field is required"]}
                                disabled={[0, 3].includes(state.status) ? true : false}
                            />
                                {
                                    !id &&
                                    (
                                        <Box>
                                            <TextField
                                                name="password"
                                                label="Mật khẩu"
                                                type="password"
                                                autoComplete="current-password"
                                                onChange={handleChange}
                                                value={state.password || ""}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                                disabled={[0, 3].includes(state.status) ? true : false}
                                            />
                                            <TextField
                                                name="cpassword"
                                                label="Xác nhận mật khẩu"
                                                type="password"
                                                onChange={handleChange}
                                                value={state.cpassword || ""}
                                                validators={["required", "isPasswordMatch"]}
                                                errorMessages={["this field is required", "password didn't match"]}
                                                disabled={[0, 3].includes(state.status) ? true : false}
                                            />
                                        </Box>
                                    )
                                }
                        </Grid>

                        <Grid item lg={8} md={8} sm={12} xs={12} sx={{ mt: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item lg={id ? 8 : 12} md={id ? 8 : 12} sm={12} xs={12} 
                                    sx={{ mt: 2, paddingTop: "0 !important"  }}
                                >
                                    <TextField
                                        name="fullname"
                                        label="Họ tên"
                                        onChange={handleChange}
                                        value={state.fullname || ""}
                                        validators={["required"]}
                                        errorMessages={["This field is required"]}
                                        disabled={[0, 3].includes(state.status) ? true : false}
                                    />
                                </Grid>
                                {
                                    id &&
                                    <Grid item lg={4} md={4} sm={12} xs={12} sx={{ mt: 2, paddingTop: "0 !important" }}>
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
                                            disabled={[0, 3].includes(state.status) ? true : false}
                                        />
                                    </Grid>
                                }
                            </Grid>
                            {
                                otherRoles && currentRoles && 
                                    <Box sx={{ border: 1, borderColor: "#D1D5DB", borderRadius: "4px" }}>
                                        <TransferList
                                            status={ state.status }
                                            left={ otherRoles }
                                            right={ currentRoles }
                                            setLeft={ setOtherRoles }
                                            setRight={ setCurrentRoles }
                                        />
                                    </Box>
                            }
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
                            [0, 3].includes(state.status) &&
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
