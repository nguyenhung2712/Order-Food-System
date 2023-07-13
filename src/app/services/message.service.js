import axiosInstance from "../../axios";


const uploadImage = async (formData) => {
    return await axiosInstance.post("/message/upload-image",
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
};

const MessageService = {
    uploadImage
};

export default MessageService;