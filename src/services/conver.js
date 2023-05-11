const { Conversation, User, Message, AdminStaff } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Conversation.findAll({
            include: [
                { model: User, as: "user" },
                {
                    model: Message,
                    include: [
                        { model: User, as: "user" },
                        { model: AdminStaff, as: "admin" }
                    ],
                },
            ],
            order: [
                [
                    { model: Message },
                    'createdAt', 'ASC'
                ]
            ],
        });
        resolve({
            status: "success",
            message: "Get conversations successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByStaffId = (staffId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Conversation.findAll({
            where: { adminId: staffId },
            include: [
                { model: User, as: "user" },
                {
                    model: Message,
                    include: [
                        { model: User, as: "user" },
                        { model: AdminStaff, as: "admin" }
                    ],
                },
            ],
            order: [
                [
                    { model: Message },
                    'createdAt', 'ASC'
                ]
            ],
        });
        resolve({
            status: "success",
            message: "Get conversations successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (converId) => new Promise(async (resolve, reject) => {
    try {
        const conver = await Conversation.findOne({
            where: { id: converId },
            include: [
                { model: User, as: "user" },
                {
                    model: Message,
                    include: [
                        { model: User, as: "user" },
                        { model: AdminStaff, as: "admin" }
                    ],
                    order: [
                        ['createdAt', 'ASC']
                    ],
                },
            ]
        });
        resolve({
            status: "success",
            message: "Get conversations successfully.",
            payload: conver
        });
    } catch (error) {
        reject(error);
    }
});

const createConver = (userId, adminId, converBody) => new Promise(async (resolve, reject) => {
    try {
        await Conversation.create(
            {
                id: uuidv4(),
                ...converBody,
                deletedAt: null,
                status: 1,
                userId,
                adminId
            }
        )
            .then(conver => {
                resolve({
                    status: "success",
                    message: "Create conversation successfully.",
                    payload: conver
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateConver = (converId, converBody) => new Promise(async (resolve, reject) => {
    try {
        await Conversation.update(
            { ...converBody },
            { where: { id: converId } }
        )
            .then(() => Conversation.findByPk(converId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Message,
                        include: [
                            { model: User, as: "user" },
                            { model: AdminStaff, as: "admin" }
                        ],
                        order: [
                            ['createdAt', 'ASC']
                        ],
                    },
                ]
            }))
            .then(conver => {
                resolve({
                    status: "success",
                    message: "Update conversation successfully.",
                    payload: conver
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteConver = (converId) => new Promise(async (resolve, reject) => {
    try {
        await Conversation.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: converId } }
        )
            .then(() => Conversation.findByPk(converId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Message,
                        include: [
                            { model: User, as: "user" },
                            { model: AdminStaff, as: "admin" }
                        ],
                        order: [
                            ['createdAt', 'ASC']
                        ],
                    },
                ]
            }))
            .then(conver => {
                resolve({
                    status: "success",
                    message: "Delete conversation successfully.",
                    payload: conver
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverConver = (converId) => new Promise(async (resolve, reject) => {
    try {
        await Conversation.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: converId } }
        )
            .then(() => Conversation.findByPk(converId, {
                include: [
                    { model: User, as: "user" },
                    {
                        model: Message,
                        include: [
                            { model: User, as: "user" },
                            { model: AdminStaff, as: "admin" }
                        ],
                        order: [
                            ['createdAt', 'ASC']
                        ],
                    },
                ]
            }))
            .then(conver => {
                resolve({
                    status: "success",
                    message: "Recover conversation successfully.",
                    payload: conver
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByStaffId,
    createConver,
    updateConver,
    deleteConver,
    recoverConver
}