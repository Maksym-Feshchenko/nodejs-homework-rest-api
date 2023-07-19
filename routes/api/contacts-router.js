import express from "express";

import {contactsController} from "../../controllers/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactSchema} from "../../schemas/index.js";

import {isEmptyBody} from "../../middlewares/index.js";

const contactRouter = express.Router();

contactRouter.get("/", contactsController.getAll)

contactRouter.get("/:id", contactsController.getById)

contactRouter.post("/", isEmptyBody, validateBody(contactSchema.contactAddSchema), contactsController.add);

contactRouter.put("/:id", isEmptyBody, validateBody(contactSchema.contactAddSchema), contactsController.updateById);
  
contactRouter.delete("/:id", contactsController.deleteById)

export default contactRouter;