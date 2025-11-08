import { Router } from "express";
import { getAllUsers, getUserById, signUp, signIn } from "../controllers/user.controller";
import { isSuperAdmin } from "../middlewares/role.middleware";

const userRouter: Router = Router();

userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

userRouter.get("/", isSuperAdmin, getAllUsers);
userRouter.get("/:id", getUserById);

export default userRouter;
