import Joi from "joi";

const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
      "any.required": 'missing required name field'
    }),
    email: Joi.string().required(),
    phone: Joi.string().required(),
})

export default {
    contactAddSchema,
};