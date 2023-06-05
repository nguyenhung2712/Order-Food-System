import axiosInstance from "../../axios";

const createMessage = async (message) => {
    return await axiosInstance.post("/message/create", message);
};

const updateMessage = async (messageId, newInfo) => {
    return await axiosInstance.put("/message/update/" + messageId, newInfo);
};

const uploadImage = async (formData) => {
    return await axiosInstance.post("/message/upload-image",
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' }
        }
    );
};

const MessageService = {
    /* getAllMessages,
    getMessageById, */
    createMessage,
    uploadImage
    /* updateMessage */
};

export default MessageService;