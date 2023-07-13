import axiosInstance from "../../axios";

const getAllBlogs = async (config) => {
    return await axiosInstance.get("/blog/all", config);
};

const getAllReports = async (config) => {
    return await axiosInstance.get("/blog/report/all", config);
};

const getBlogById = async (blogId, config) => {
    return await axiosInstance.get("/blog/" + blogId, config);
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
    deleteReport
};

export default BlogService;