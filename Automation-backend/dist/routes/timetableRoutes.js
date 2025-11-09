"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const timetableService_1 = __importDefault(require("../services/timetableService"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
const timetableService = new timetableService_1.default();
router.post('/generate-timetable', async (req, res) => {
    try {
        logger_1.default.info('Received request to generate timetable');
        const success = await timetableService.generateTimetable();
        if (success) {
            res.status(200).json({
                message: 'Timetable generated and stored successfully'
            });
        }
        else {
            res.status(500).json({
                error: 'Failed to generate timetable'
            });
        }
    }
    catch (error) {
        logger_1.default.error('Error in /generate-timetable route:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});
router.get('/timetable', async (req, res) => {
    try {
        logger_1.default.info('Received request to fetch timetable');
        const timetableEntries = await timetableService.getAllTimetableEntries();
        res.status(200).json({
            message: 'Timetable entries fetched successfully',
            data: timetableEntries
        });
    }
    catch (error) {
        logger_1.default.error('Error in /timetable route:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});
router.delete('/timetable', async (req, res) => {
    try {
        logger_1.default.info('Received request to clear timetable');
        await timetableService.clearTimetable();
        res.status(200).json({
            message: 'Timetable cleared successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error in /timetable DELETE route:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=timetableRoutes.js.map