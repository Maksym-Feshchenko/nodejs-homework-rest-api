import contactsService from "../models/db/contacts.js";

import {HttpError} from "../helpers/index.js"

import {ctrlWrapper} from "../decorators/index.js"

const getAll = async(req, res) => {
        const result = await contactsService.listContacts();
        res.json(result);

}

const getById = async (req, res, next) => {
        const { id } = req.params;
        const result = await contactsService.getContactById(id);
        if(!result) {
            throw HttpError(404, "Not found")
        }
        res.json(result);
}

const add = async (req, res, next) => {
      const { error } = contactAddSchema.validate(req.body);
      if (error) {
        const missingField = error.details[0].context.key;
        throw HttpError(400, `missing required "${missingField}" field`);
      }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result);
  }

const updateById = async (req, res, next) => {
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
  }

const deleteById = async(req, res, next) =>{
        const {id} = req.params;
        const result = await contactsService.removeContact(id);
        if(!result) {
            throw HttpError(404, "Not found")
        }
        res.json({
            message: "contact deleted"
        })   
}

export default {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}