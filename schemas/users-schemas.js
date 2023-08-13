import Joi from "joi";

import { emailRegexp } from "../constans/user-constans.js";

const userSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required().messages({
        "string.email": `Invalid email format.`,
        "string.empty": `Email cannot be an empty field.`,
        "string.pattern.base": `Invalid email format.`,
        "any.required": `Email is a required field.`,
      }),
    password: Joi.string().min(8).required().messages({
        "string.min": `Password should have a minimum length of {#limit}.`,
        "any.required": `Password is a required field.`,
      }),
})

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "string.email": `Invalid email format.`,
    "string.empty": `Email cannot be an empty field.`,
    "string.pattern.base": `Invalid email format.`,
    // "any.required": `Email is a required field.`,
    "any.required": `missing required field email.`,
  }),
})

export default {
    userSchema,
    userEmailSchema,
}