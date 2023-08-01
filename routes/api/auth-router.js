import express from "express";
// const router = express.Router();

import authController from "../../controllers/auth-controller.js";

import usersSchemas from "../../schemas/users-schemas.js";

import {validateBody} from "../../decorators/index.js"; 

import authenticate from "../../middlewares/authenticate.js"

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userSchema), authController.signup);

authRouter.post("/login", validateBody(usersSchemas.userSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;