import axiosInstance from "../../axios";

const getAllSchedules = async (config) => {
    return await axiosInstance.get("/schedule/all", config);
};

const getAllType = async () => {
    return await axiosInstance.get("/schedule/type/all");
};

const createSchedule = async (body) => {
    return await axiosInstance.post("/schedule/create", body);
};

const updateSchedule = async (id, body) => {
    return await axiosInstance.put("/schedule/update/" + id, body);
};

const deleteSchedule = async (id) => {
    return await axiosInstance.delete("/schedule/delete/" + id);
};

const ScheduleService = {
    getAllType,
    getAllSchedules,
    createSchedule,
    updateSchedule,
    deleteSchedule
};

export default ScheduleService;