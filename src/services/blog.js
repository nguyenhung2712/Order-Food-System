const { Blog, InteractBlog, User, History, Address, UserAddress, Province, District, Ward } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { slugify } = require("../utils/createSlug");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll({
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getAllBySort = (sortBy) => new Promise(async (resolve, reject) => {
    try {
        let sortType;
        switch (sortBy) {
            case "oldest": sortType = "ASC"; break;
            default: sortType = "DESC"; break;
        }
        const response = await Blog.findAll({
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ],
            order: [
                ['createdAt', sortType]
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getBySortUserId = (userId, sortBy) => new Promise(async (resolve, reject) => {
    try {
        let sortType;
        switch (sortBy) {
            case "oldest": sortType = "ASC"; break;
            default: sortType = "DESC"; break;
        }
        const response = await Blog.findAll({
            where: { userId },
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ],
            order: [
                ['createdAt', sortType]
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByUserId = (userId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Blog.findAll({
            where: { userId },
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ],
            attributes: { attributes: { exclude: ['userId'] } }
        });
        resolve({
            status: "success",
            message: "Get blogs successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (blogId) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { id: blogId },
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ]
        });
        resolve({
            status: "success",
            message: "Get blog successfully.",
            payload: blog
        });
    } catch (error) {
        reject(error);
    }
});

const getBySlug = (slug) => new Promise(async (resolve, reject) => {
    try {
        const blog = await Blog.findOne({
            where: { slug },
            include: [
                {
                    model: User, as: "user",
                    include: [
                        {
                            model: UserAddress,
                            include: [
                                {
                                    model: Address, as: "address",
                                    include: [
                                        { model: Province, as: "province" },
                                        { model: District, as: "district" },
                                        { model: Ward, as: "ward" },
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    model: InteractBlog,
                    include: [{ model: User, as: "user" }]
                }
            ]
        });

        resolve({
            status: "success",
            message: "Get blog successfully.",
            payload: blog
        });
    } catch (error) {
        reject(error);
    }
});

const createBlog = (userId, blogBody) => new Promise(async (resolve, reject) => {
    try {

        await Blog.create(
            {
                id: uuidv4(),
                ...blogBody,
                slug: slugify(blogBody.header),
                deletedAt: null,
                status: 1,
                userId
            }
        )
            .then(async (blog) => {
                await History.create({
                    userId, blogId: blog.id, action: "Tạo blog"
                });
                resolve({
                    status: "success",
                    message: "Create blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateBlog = (blogId, blogBody) => new Promise(async (resolve, reject) => {
    try {
        await Blog.update(
            { ...blogBody },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: InteractBlog,
                        include: [{ model: User, as: "user" }]
                    }
                ]
            }))
            .then(async (blog) => {
                await History.create({
                    userId: blog.userId, blogId: blog.id, action: `Cập nhật blog ${blog.id}`
                });
                resolve({
                    status: "success",
                    message: "Update blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteBlog = (blogId) => new Promise(async (resolve, reject) => {
    try {
        await Blog.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: InteractBlog,
                        include: [{ model: User, as: "user" }]
                    }
                ]
            }))
            .then(async (blog) => {
                await History.create({
                    userId: blog.userId, blogId: blog.id, action: `Đã xóa blog ${blog.id}`
                });
                resolve({
                    status: "success",
                    message: "Delete blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverBlog = (blogId) => new Promise(async (resolve, reject) => {
    try {
        await Blog.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: blogId } }
        )
            .then(() => Blog.findByPk(blogId, {
                include: [
                    {
                        model: User, as: "user",
                        include: [
                            {
                                model: UserAddress,
                                include: [
                                    {
                                        model: Address, as: "address",
                                        include: [
                                            { model: Province, as: "province" },
                                            { model: District, as: "district" },
                                            { model: Ward, as: "ward" },
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: InteractBlog,
                        include: [{ model: User, as: "user" }]
                    }
                ]
            }))
            .then(blog => {
                resolve({
                    status: "success",
                    message: "Recover blog successfully.",
                    payload: blog
                });
            });
    } catch (error) {
        reject(error);
    }
});

const interactBlog = (userId, blogId, type, reason) => new Promise(async (resolve, reject) => {
    try {
        await InteractBlog.findOne({
            where: { userId, blogId, type }
        })
            .then(async (res) => {
                if (res) {
                    if (reason) {
                        await InteractBlog.create(
                            {
                                userId, blogId, type,
                                deletedAt: null,
                                status: 1,
                                reason
                            },
                        )
                    } else {
                        await InteractBlog.update(
                            {
                                deletedAt: res.status === 1 ? new Date() : null,
                                status: res.status === 1 ? 0 : 1
                            },
                            { where: { userId, blogId, type } }
                        );
                    }
                    resolve({
                        status: "success",
                        message: "Interact blog successfully."
                    });
                } else {
                    await InteractBlog.create(
                        {
                            userId, blogId, type,
                            deletedAt: null,
                            status: 1,
                            reason
                        },
                    )
                    resolve({
                        status: "success",
                        message: "Interact blog successfully."
                    });
                }
            });
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    getAll,
    getAllBySort,
    getById,
    getBySortUserId,
    getByUserId,
    getBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    recoverBlog,
    interactBlog
}