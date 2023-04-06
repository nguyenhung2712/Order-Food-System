const { trackerService } = require('../services');
const { interalServerError, badRequest } = require('../middlewares/HandleErrors');

const getTrackersById = async (req, res) => {
    try {
        const { id, type } = req.params;
        let response;
        switch (type) {
            case "user": response = await trackerService.getTrackersByUserId(req.params.id);
            case "staff": response = await trackerService.getTrackersByAdminId(req.params.id);
        }
        res.json(response);
    } catch (error) {
        return interalServerError(res);
    }
}

module.exports = {
    getTrackersById
}