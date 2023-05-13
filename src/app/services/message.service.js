import axiosInstance from "../../axios";

const createMessage = async (message) => {
    return await axiosInstance.post("/message/create", message);
};

const updateMessage = async (messageId, newInfo) => {
    return await axiosInstance.put("/message/update/" + messageId, newInfo);
};

const MessageService = {
    /* getAllMessages,
    getMessageById, */
    createMessage,
    /* updateMessage */
};

export default MessageService;