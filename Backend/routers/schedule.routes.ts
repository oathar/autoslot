import { Router } from "express";
import { 
  updateScheduleProgress, 
  markAttendance, 
  addResource,
  getTodaySchedule 
} from "../controllers/schedule.controller";

const scheduleRouter: Router = Router();

scheduleRouter.get("/teacher/:teacher_id", getTodaySchedule);
scheduleRouter.put("/:id/progress", updateScheduleProgress);
scheduleRouter.post("/attendance", markAttendance);
scheduleRouter.post("/resource", addResource);

export default scheduleRouter;
