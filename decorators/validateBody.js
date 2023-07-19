import {HttpError} from "../helpers/index.js"

const validateBody = schema => {
    const func = (req, res, next)=> {
        const { error } = schema.validate(req.body); 
        if (error) {
          const missingField = error.details[0].context.key;
          next(HttpError(400, `missing required "${missingField}" field`));
        }
        next();
    }
    return func;
}

export default validateBody;