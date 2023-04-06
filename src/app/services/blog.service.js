import axiosInstance from "../../axios";

const getAllBlogs = async () => {
    return await axiosInstance.get("/blog/all");
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

const BlogService = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog,
    recoverBlog
};

export default BlogService;