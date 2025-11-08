import { Router } from "express";
import { 
  createRequest, 
  approveRequest, 
  rejectRequest,
  getAllRequests,
  getRequestById 
} from "../controllers/request.controller";

const requestRouter: Router = Router();

requestRouter.get("/", getAllRequests);
requestRouter.get("/:id", getRequestById);
requestRouter.post("/", createRequest);
requestRouter.put("/:id/approve", approveRequest);
requestRouter.put("/:id/reject", rejectRequest);

export default requestRouter;
