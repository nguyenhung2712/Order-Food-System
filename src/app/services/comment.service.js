import axiosInstance from "../../axios";

const getCommentByBlogId = async (blogId, page, limit, sortBy) => {
    return await axiosInstance.get("/comment/blog/" + blogId + `?page=${page}&limit=${limit}&sort=${sortBy}`);
};

const updateComment = async (commentId, newInfo) => {
    return await axiosInstance.put("/comment/update/" + commentId, newInfo);
};

const CommentService = {
    getCommentByBlogId,
    updateComment
};

export default CommentService;