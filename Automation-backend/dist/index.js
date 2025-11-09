"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const timetableRoutes_1 = __importDefault(require("./routes/timetableRoutes"));
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', timetableRoutes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Automation backend is running',
        timestamp: new Date().toISOString()
    });
});
app.use((err, req, res, next) => {
    logger_1.default.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        details: err.message
    });
});
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found'
    });
});
app.listen(PORT, () => {
    logger_1.default.info(`Automation backend server is running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map