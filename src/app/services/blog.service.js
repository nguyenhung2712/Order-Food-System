import axiosInstance from "../../axios";

const getAllBlogs = async () => {
    return await axiosInstance.get("/blog/all");
};

const getAllReports = async () => {
    return await axiosInstance.get("/blog/report/all");
};

const getBlogById = async (blogId) => {
    return await axiosInstance.get("/blog/" + blogId);
};

const createBlog = async (blog) => {
    return await axiosInstance.post("/blog/create", blog);
};

const updateBlog = async (blogId, newInfo) => {
    return await axiosInstance.put("/blog/update/" + blogId, newInfo);
};

const deleteBlog = async (blogId) => {
    return await axiosInstance.put("/blog/delete/" + blogId);
};

const recoverBlog = async (blogId) => {
    return await axiosInstance.put("/blog/recover/" + blogId);
};

const solveReport = async (blogId, userId) => {
    return await axiosInstance.post("/blog/report/solve", { userId, blogId });
};

const getSolvedBlogs = async () => {
    return await axiosInstance.get("/blog/report/solved/all");
};
const deleteReport = async (id) => {
    return await axiosInstance.delete("/report/delete/" + id);
};

const BlogService = {
    getAllBlogs,
    getAllReports,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    recoverBlog,
    solveReport,
    getSolvedBlogs,
    deleteReport
};

export default BlogService;