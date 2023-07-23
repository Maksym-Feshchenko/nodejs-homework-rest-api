import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/index.js";

const isValidIdFavorite = ( req, res, next )=> {
    const {id} = req.params;
        if(!isValidObjectId(id)) {
            return next(HttpError(400, `missing field favorite`))
        }
        next();
}

export default isValidIdFavorite;