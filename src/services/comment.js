const { Comment, User, Blog, CommentRep, Interact } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { Op } = require('sequelize');

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Comment.findAll({
            include: [
                { model: User, as: "user" },
                { model: Blog, as: "blog" },
                {
                    model: CommentRep,
                    include: [
                        { model: User, as: "user" },
                        { model: Comment, as: "comment" },
                        {
                            model: CommentRep, as: "rep",
                            order: [['createdAt', 'ASC']],
                            include: [{ model: User, as: "user" }],
                        },
                        {
                            model: Interact,
                            include: [{ model: User, as: "user" }]
                        }
                    ]
                },
                {
                    model: Interact,
                    include: [{ model: User, as: "user" }]
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        resolve({
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByFKId = (type, id, sortBy) => new Promise(async (resolve, reject) => {
    try {
        let sortType;
        switch (sortBy) {
            case "oldest": sortType = "ASC"; break;
            default: sortType = "DESC"; break;
        }
        const response = type === "user"
            ? await Comment.findAll({
                where: { userId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Blog, as: "blog" },
                    {
                        model: CommentRep,
                        include: [
                            { model: User, as: "user" },
                            { model: Comment, as: "comment" },
                            {
                                model: CommentRep, as: "rep",
                                order: [['createdAt', 'ASC']],
                                include: [{ model: User, as: "user" }],
                            },
                            {
                                model: Interact,
                                include: [{ model: User, as: "user" }]
                            }
                        ]
                    },
                    {
                        model: Interact,
                        include: [{ model: User, as: "user" }]
                    }
                ],
                order: [
                    ['createdAt', sortType]
                ],
            })
            : await Comment.findAll({
                where: { blogId: id },
                include: [
                    { model: User, as: "user" },
                    { model: Blog, as: "blog" },
                    {
                        model: CommentRep,
                        include: [
                            { model: User, as: "user" },
                            { model: Comment, as: "comment" },
                            {
                                model: CommentRep, as: "rep",
                                order: [['createdAt', 'ASC']],
                                include: [{ model: User, as: "user" }],
                            },
                            {
                                model: Interact,
                                include: [{ model: User, as: "user" }]
                            }
                        ]
                    },
                    {
                        model: Interact,
                        include: [{ model: User, as: "user" }]
                    }
                ],
                order: [
                    ['createdAt', sortType]
                ],
            });
        resolve({
            status: "success",
            message: "Get comments successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (commentId) => new Promise(async (resolve, reject) => {
    try {
        const comment = await Comment.findOne({
            where: { id: commentId },
            include: [
                { model: User, as: "user" },
                { model: Blog, as: "blog" },
                {
                    model: CommentRep,
                    include: [
                        { model: User, as: "user" },
                        { model: Comment, as: "comment" },
                        {
                            model: CommentRep, as: "rep",
                            order: [['createdAt', 'ASC']],
                            include: [{ model: User, as: "user" }],
                        },
                        {
                            model: Interact,
                            include: [{ model: User, as: "user" }]
                        }
                    ]
                },
                {
                    model: Interact,
                    include: [{ model: User, as: "user" }]
                }
            ],
        });
        resolve({
            status: "success",
            message: "Get comment successfully.",
            payload: comment
        });
    } catch (error) {
        reject(error);
    }
});

const createComment = (userId, blogId, commentBody) => new Promise(async (resolve, reject) => {
    try {
        await Comment.create(
            {
                id: uuidv4(),
                ...commentBody,
                userId,
                blogId
            }
        )
            .then(comment => {
                resolve({
                    status: "success",
                    message: "Create comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateComment = (commentId, commentBody) => new Promise(async (resolve, reject) => {
    try {
        await Comment.update(
            { ...commentBody },
            { where: { id: commentId } }
        )
            .then(() => Comment.findByPk(commentId, {
                include: [
                    { model: User, as: "user" },
                    { model: Blog, as: "blog" },
                    {
                        model: CommentRep,
                        include: [
                            { model: User, as: "user" },
                            { model: Comment, as: "comment" },
                            {
                                model: CommentRep, as: "rep",
                                order: [['createdAt', 'ASC']],
                                include: [{ model: User, as: "user" }],
                            },
                            {
                                model: Interact,
                                include: [{ model: User, as: "user" }]
                            }
                        ]
                    },
                    {
                        model: Interact,
                        include: [{ model: User, as: "user" }]
                    }
                ],
            }))
            .then(comment => {
                resolve({
                    status: "success",
                    message: "Update comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteComment = (commentId) => new Promise(async (resolve, reject) => {
    try {
        await Comment.destroy({ where: { id: commentId } })
            .then(comment => {
                resolve({
                    status: "success",
                    message: "Delete comment successfully.",
                    payload: comment
                });
            });
    } catch (error) {
        reject(error);
    }
});

const interactComment = (userId, commentId, type, reason) => new Promise(async (resolve, reject) => {
    try {
        await Interact.findOne({
            where: { userId, commentId, type }
        })
            .then(async (res) => {
                if (res) {
                    if (reason) {
                        await Interact.create(
                            {
                                userId, commentId, type,
                                deletedAt: null,
                                status: 1,
                                reason
                            },
                        );
                    } else {
                        await Interact.update(
                            {
                                deletedAt: res.status === 1 ? new Date() : null,
                                status: res.status === 1 ? 0 : 1,
                                reason
                            },
                            { where: { userId, commentId, type } }
                        );
                    }
                    resolve({
                        status: "success",
                        message: "Interact comment successfully."
                    });
                } else {
                    await Interact.create(
                        {
                            userId, commentId, type,
                            deletedAt: null,
                            status: 1,
                            reason
                        },
                    )
                    resolve({
                        status: "success",
                        message: "Interact comment successfully."
                    });
                }
            });
    } catch (error) {
        reject(error);
    }
})

module.exports = {
    getAll,
    getById,
    getByFKId,
    createComment,
    updateComment,
    deleteComment,
    interactComment
}