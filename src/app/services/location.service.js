import axiosInstance from "../../axios";

const getAllProvinces = async () => {
    return await axiosInstance.get("/location/provinces");
};

const LocationService = {
    getAllProvinces,
};

export default LocationService;