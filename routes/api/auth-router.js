import express from "express";

import authController from "../../controllers/auth-controller.js";

import usersSchemas from "../../schemas/users-schemas.js";

import {validateBody} from "../../decorators/index.js"; 

import {authenticate, upload} from "../../middlewares/index.js"

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userSchema), authController.signup);

authRouter.get("/verify/:verificationToken", authController.verify);

authRouter.post("/verify", validateBody(usersSchemas.userEmailSchema), authController.resendVerifyEmail)

authRouter.post("/login", validateBody(usersSchemas.userSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent)

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch("/avatars", authenticate, upload, authController.updateAvatar)

export default authRouter;