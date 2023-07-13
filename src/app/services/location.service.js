import axiosInstance from "../../axios";

const getAllProvinces = async (config) => {
    return await axiosInstance.get("/location/provinces", config);
};
const getAllRegions = async (config) => {
    return await axiosInstance.get("/location/regions", config);
};

const LocationService = {
    getAllProvinces,
    getAllRegions
};

export default LocationService;