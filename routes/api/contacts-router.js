import express from "express";

import {contactsController} from "../../controllers/index.js";

import {validateBody} from "../../decorators/index.js";

import {contactSchema} from "../../schemas/index.js";

import {isEmptyBody, isValidId, isValidIdFavorite} from "../../middlewares/index.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll)

contactsRouter.get("/:id", isValidId, contactsController.getById)

contactsRouter.post("/", isEmptyBody,  validateBody(contactSchema.contactAddSchema), contactsController.add);

contactsRouter.put("/:id", isValidId, isEmptyBody, validateBody(contactSchema.contactAddSchema), contactsController.updateById);
 
contactsRouter.patch("/:id/favorite", isValidIdFavorite, isEmptyBody, validateBody(contactSchema.contactUpdateFavoriteSchema), contactsController.updateFavorite);

contactsRouter.delete("/:id", isValidId, contactsController.deleteById)

export default contactsRouter;