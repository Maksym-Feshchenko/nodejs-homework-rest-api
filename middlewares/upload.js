import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const {originalname} = file;    
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
        const filename = `${uniquePrefix}_${originalname}`;
        cb(null, filename);     
    }
});

const limits = {
    fileSize: 1024 * 1024 * 5,
}

const upload = multer({
    storage,
    limits,
})

const avatarProcessor = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const image = await Jimp.read(req.file.path);
        await image.resize(250, 250);
        await image.writeAsync(req.file.path);
        next();
    } catch (error) {
        next(error);
    }}


export default upload;

