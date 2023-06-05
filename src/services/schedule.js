const { Schedule, AdminStaff, ScheduleType, AdminSchedule } = require("../models");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/sendEmail");

const getAllType = () => new Promise(async (resolve, reject) => {
    try {
        const response = await ScheduleType.findAll();
        resolve({
            status: "success",
            message: "Get types successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const getAll = () => new Promise(async (resolve, reject) => {
    try {
        const response = await Schedule.findAll({
            include: [
                {
                    model: AdminSchedule,
                    include: [
                        { model: AdminStaff, as: "admin" }
                    ]
                },
                { model: ScheduleType, as: "type" }
            ],
        });
        resolve({
            status: "success",
            message: "Get schedules successfully.",
            payload: response
        });
    } catch (error) {
        reject(error);
    }
});

const createSchedule = (body) => new Promise(async (resolve, reject) => {
    try {
        let { adminIds, ...postInput } = body;
        await Schedule.create({ id: uuidv4(), ...postInput })
            .then((schedule) => {
                adminIds.forEach(async (adminId) => {
                    const admin = await AdminStaff.findByPk(adminId);
                    await AdminSchedule.create({ adminId, scheduleId: schedule.id });

                    /* await sendEmail(admin.email, "Lịch phân công", `...`); */

                });
                resolve({
                    status: "success",
                    message: "Create schedule successfully.",
                    payload: schedule,
                    staffIds: adminIds
                });
            });
    } catch (error) {
        reject(error);
    }
});

const updateSchedule = (scheduleId, body) => new Promise(async (resolve, reject) => {
    try {
        let { adminIds, ...postInput } = body;
        await Schedule.update({ ...postInput }, { where: { id: scheduleId } })
            .then(async () => await Schedule.findByPk(scheduleId, {
                include: [
                    {
                        model: AdminSchedule,
                        include: [
                            { model: AdminStaff, as: "admin" }
                        ]
                    },
                    { model: ScheduleType, as: "type" }
                ],
            }))
            .then((schedule) => {
                if (adminIds) {
                    adminIds.forEach(async (adminId) => {
                        const admin = await AdminStaff.findByPk(adminId);
                        const [adminSchedule, created] = await AdminSchedule.findOrCreate({
                            where: { adminId, scheduleId: schedule.id },
                        });
                        /* if (created) {
                            await sendEmail(admin.email, "Lịch phân công thay đổi", `...`);
                        } else {
                            await sendEmail(admin.email, "Lịch phân công", `...`);
                        } */
                        await AdminSchedule.destroy({
                            where: { adminId: { [Op.notIn]: adminIds } }
                        });
                    });
                }
                resolve({
                    status: "success",
                    message: "Update schedule successfully.",
                    payload: schedule
                });
            });
    } catch (error) {
        reject(error);
    }
});

const deleteSchedule = (scheduleId) => new Promise(async (resolve, reject) => {
    try {
        await Schedule.findByPk(scheduleId, {
            include: [
                {
                    model: AdminSchedule,
                    include: [
                        { model: AdminStaff, as: "admin" }
                    ]
                },
                { model: ScheduleType, as: "type" }
            ],
        })
            .then(async (res) => {
                let admins = res.AdminSchedules;
                admins.forEach(async (admin) => {
                    await sendEmail(admin.email, "Lịch phân công đã được hủy", `...`);
                });
                await Schedule.destroy({ where: { id: scheduleId } })
                    .then((schedule) => {
                        resolve({
                            status: "success",
                            message: "Delete schedule successfully.",
                            payload: schedule
                        });
                    });
            })

    } catch (error) {
        reject(error);
    }
});

module.exports = {
    getAllType,
    getAll,
    createSchedule,
    updateSchedule,
    deleteSchedule
}