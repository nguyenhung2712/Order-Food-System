const { Address, UserAddress, Province, District, Ward, User } = require("../models");
const { v4: uuidv4 } = require("uuid");

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Address.findAll();
        resolve({
            status: "success",
            message: "Get addresses successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getByFKId = (districtId, provinceId, wardId) => new Promise(async (resolve, reject) => {
    try {
        const response = await Address.findOne({
            where: {
                districtId,
                provinceId,
                wardId
            }
        });
        resolve({
            status: "success",
            message: "Get address successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getById = (addressId) => new Promise(async (resolve, reject) => {
    try {
        const address = await Address.findOne({
            where: { id: addressId }
        });
        resolve({
            status: "success",
            message: "Get address successfully.",
            payload: address
        });
    } catch (error) {
        reject(error);
    }
});

const createAddress = (districtId, provinceId, wardId, addressBody) => new Promise(async (resolve, reject) => {
    try {
        await Address.create(
            {
                id: uuidv4(),
                ...addressBody,
                deletedAt: null,
                status: 1,
                districtId,
                provinceId,
                wardId
            }
        )
            .then(address => {
                resolve({
                    status: "success",
                    message: "Create address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateAddress = (addressId, addressBody) => new Promise(async (resolve, reject) => {
    try {
        await Address.update(
            { ...addressBody },
            { where: { id: addressId } }
        )
            .then(() => Address.findByPk(addressId))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Update address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteAddress = (addressId) => new Promise(async (resolve, reject) => {
    try {
        await Address.update(
            {
                deletedAt: new Date(),
                status: 0
            },
            { where: { id: addressId } }
        )
            .then(() => Address.findByPk(addressId))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Delete address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverAddress = (addressId) => new Promise(async (resolve, reject) => {
    try {
        await Address.update(
            {
                deletedAt: null,
                status: 2
            },
            { where: { id: addressId } }
        )
            .then(() => Address.findByPk(addressId))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Recover address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const getUserAddressById = (userId) => new Promise(async (resolve, reject) => {
    try {
        await UserAddress.findAll({
            where: { userId },
            include: [
                { model: User, as: "user" },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                    ]
                }
            ],
        })
            .then(addresses => {
                resolve({
                    status: "success",
                    message: "Get addresses successfully.",
                    payload: addresses
                });
            });
    } catch (error) {
        reject(error);
    }
});

const getUserAddressByDefault = (userId) => new Promise(async (resolve, reject) => {
    try {
        await UserAddress.findOne({
            where: { userId, isDefault: 1 },
            include: [
                { model: User, as: "user" },
                {
                    model: Address, as: "address",
                    include: [
                        { model: Province, as: "province" },
                        { model: District, as: "district" },
                        { model: Ward, as: "ward" },
                    ]
                }
            ],
        })
            .then(address => {
                resolve({
                    status: "success",
                    message: "Get address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const createUserAddress = (userId, addressId, info) => new Promise(async (resolve, reject) => {
    try {
        const addresses = await getUserAddressById(userId);
        await UserAddress.create({
            ...info,
            userId,
            addressId,
            deletedAt: null,
            status: 1,
            isDefault: (addresses || addresses.length === 0) ? 1 : 0
        })
            .then(address => {
                resolve({
                    status: "success",
                    message: "Create user's address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateUserAddress = (userId, addressId, body) => new Promise(async (resolve, reject) => {
    try {
        await UserAddress.update(
            { ...body },
            { where: { userId, addressId } }
        )
            .then(() => UserAddress.findOne({
                where: { userId, addressId },
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    }
                ],
            }))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Update user's address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteUserAddress = (userId, addressId) => new Promise(async (resolve, reject) => {
    try {
        await UserAddress.update(
            {
                deletedAt: new Date(),
                status: 1,
            },
            { where: { userId, addressId } }
        )
            .then(() => UserAddress.findOne({
                where: { userId, addressId },
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    }
                ],
            }))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Delete user's address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

const recoverUserAddress = (userId, addressId) => new Promise(async (resolve, reject) => {
    try {
        await UserAddress.update(
            {
                deletedAt: null,
                status: 0,
            },
            { where: { userId, addressId } }
        )
            .then(() => UserAddress.findOne({
                where: { userId, addressId },
                include: [
                    { model: User, as: "user" },
                    {
                        model: Address, as: "address",
                        include: [
                            { model: Province, as: "province" },
                            { model: District, as: "district" },
                            { model: Ward, as: "ward" },
                        ]
                    }
                ],
            }))
            .then(address => {
                resolve({
                    status: "success",
                    message: "Recover user's address successfully.",
                    payload: address
                });
            });
    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAll,
    getById,
    getByFKId,
    createAddress,
    updateAddress,
    deleteAddress,
    recoverAddress,

    getUserAddressById,
    getUserAddressByDefault,
    createUserAddress,
    updateUserAddress,
    deleteUserAddress,
    recoverUserAddress
}