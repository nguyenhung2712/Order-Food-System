const { trackerService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getTrackersById = async (req, res) => {
    try {
        const { id, type } = req.params;
        let response;
        switch (type) {
            case "user": response = await trackerService.getTrackersByUserId(id);
            case "staff": response = await trackerService.getTrackersByAdminId(id);
        }
        return res.json(response);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    getTrackersById
}