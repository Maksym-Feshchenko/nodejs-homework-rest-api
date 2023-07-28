import express from "express";
// const router = express.Router();

import authController from "../../controllers/auth-controller.js";

import usersSchemas from "../../schemas/users-schemas.js";

import {validateBody} from "../../decorators/index.js"; 

const authRouter = express.Router();

authRouter.post("/register", validateBody(usersSchemas.userSchema), authController.signup);

authRouter.post("/login", validateBody(usersSchemas.userSchema), authController.signin);

// router.get("/signout", authenticate, controllerWrapper(ctrl.signOut));
// router.get("/current", authenticate, controllerWrapper(ctrl.currentUser));

export default authRouter;