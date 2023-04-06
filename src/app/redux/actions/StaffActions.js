import StaffActionTypes from "../constants/StaffActionTypes";

export const init = (staffs) => {
    return {
        type: StaffActionTypes.INIT_STAFFS,
        payload: staffs,
    };
}

export const getList = () => {
    return { type: StaffActionTypes.GET_STAFFS };
}

export const create = (staff) => {
    return {
        type: StaffActionTypes.CREATE_STAFF,
        payload: { staff },
    };
}

export const update = (staffId, newInfo) => {
    return {
        type: StaffActionTypes.UPDATE_STAFF,
        payload: { staffId, newInfo },
    };
}

export const unable =  (staffId) => {
    return { 
        type: StaffActionTypes.UNABLE_STAFF,
        payload: { staffId },
    };
}

export const recover = (staffId) => {
    return { 
        type: StaffActionTypes.RECOVER_STAFF ,
        payload: { staffId },
    };
}
 