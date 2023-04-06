import StaffActionTypes from "../constants/StaffActionTypes";

const initialState = {
    staffsList: []
}

const StaffReducer = function (state = initialState, { type, payload }) {
    switch (type) {
        case StaffActionTypes.INIT_STAFFS: {
            return {
                ...state,
                staffsList: payload
            };
        }
        case StaffActionTypes.GET_STAFFS: {
            return {
                ...state,
                staffsList: payload
            };
        }
        case StaffActionTypes.CREATE_STAFF: {
            let staffsList = state.staffsList;
            return {
                ...state,
                staffsList: [...staffsList, payload.staff]
            };
        }
        case StaffActionTypes.UPDATE_STAFF: {
            const { staffId, newInfo } = payload;
            let staffsList = state.staffsList;
            let index = staffsList.findIndex(staff => staff.id === staffId);
            if (index > -1) {
                staffsList[index] = newInfo;
            }
            return {
                ...state,
                staffsList
            };
        }
        case StaffActionTypes.UNABLE_STAFF: {
            const { staffId } = payload;
            let staffsList = state.staffsList;
            let index = staffsList.findIndex(staff => staff.id === staffId);
            if (index > -1) {
                staffsList[index].status = 0;
            }
            return {
                ...state,
                staffsList
            };
        }
        case StaffActionTypes.RECOVER_STAFF: {
            const { staffId } = payload;
            let staffsList = state.staffsList;
            let index = staffsList.findIndex(staff => staff.id === staffId);
            if (index > -1) {
                staffsList[index].status = 1;
            }
            return {
                ...state,
                staffsList
            };
        }
        default: {
            return {...state};
        }
    }
};

export default StaffReducer;