import express from "express";
import Joi from "joi";

import contactsService from "../../models/db/contacts.js";

import {HttpError} from "../../helpers/index.js"

const contactRouter = express.Router();

const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

contactRouter.get("/", async(req, res) => {
    try {
        const result = await contactsService.listContacts();
        res.json(result);
    }
    catch (error) {
        next(error);
    }
})

contactRouter.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await contactsService.getContactById(id);
        if(!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result);
    }
    catch (error) {
        next(error);
    }
})

contactRouter.post("/", async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      const missingField = error.details[0].context.key;
      throw HttpError(400, `missing required "${missingField}" field`);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

contactRouter.put("/:id", async (req, res, next) => {
    try {
      if (Object.keys(req.body).length === 0) {
        throw  HttpError(400, "missing fields");
      }
  
      const requiredFields = ["name", "email", "phone"];
      const missingFields = [];
  
      for (const field of requiredFields) {
        if (!(field in req.body)) {
          missingFields.push(field);
        }
      }
  
      if (missingFields.length > 0) {
        const missingField = missingFields[0];
        throw  HttpError(400, `missing required "${missingField}" field`);
      }
  
      const { id } = req.params;
      const result = await contactsService.UpdateContactById(id, req.body);
  
      if (!result) {
        throw  HttpError(404, "Not found");
      }
  
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
  
contactRouter.delete("/:id", async(req, res, next) =>{
    try {
        const {id} = req.params;
        const result = await contactsService.removeContact(id);
        if(!result) {
            throw HttpError(404, "Not found")
        }
        res.json({
            message: "contact deleted"
        })
    }
    catch(error) {
        next(error);
    }
   
})

export default contactRouter;