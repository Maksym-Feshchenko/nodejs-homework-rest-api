import Contact from "../models/contact.js";  

import {HttpError} from "../helpers/index.js"

import {ctrlWrapper} from "../decorators/index.js"

import fs from "fs/promises";
import path from "path";

const getAll = async(req, res) => {
  const {_id: owner} = req.user;
  const { page = 1, limit = 10} = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({owner}, "-createdAt -updatedAt", {skip, limit}).populate("owner", "subscription email");
  res.json(result);
}

const getById = async (req, res, next) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
    if(!result) {
      throw HttpError(404, "Not found")
    }
  res.json(result);
}

const avatarPath = path.resolve("public", "avatars")

const add = async (req, res) => {
  const {_id: owner} = req.user;
  const {path: oldPath, filename} = req.file;
  const newPath = path.join(avatarPath, filename)
  await fs.rename(oldPath, newPath)
  const avatar = path.join("avatars", filename)
  const result = await Contact.create({...req.body, avatar, owner});
  res.status(201).json(result);
  }

const updateById = async (req, res) => {  
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw  HttpError(404, "Not found");
    }
    res.json(result);
  }

  const updateFavorite = async (req, res) => {
    const { id } = req.params;
    const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
    if (!result) {
      throw  HttpError(404, "Not found");
    }
    res.json(result);
}

const deleteById = async(req, res) =>{
  const {id} = req.params;
  const result = await Contact.findByIdAndDelete(id);
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
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById),
}