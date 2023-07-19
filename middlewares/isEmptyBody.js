import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next)=> {
    const {lenght} = Object.keys(req.body);
    if(!lenght) {
        next(HttpError(400, "fields must be required"))
    }
    next();
}


export default isEmptyBody;