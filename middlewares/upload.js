import multer from "multer";
import path from "path";
import Jimp from "jimp";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const { originalname } = file;
        const uniquePrefix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePrefix}_${originalname}`;
        cb(null, filename);
    },
});

const limits = {
    fileSize: 1024 * 1024 * 5,
};

const avatarProcessor = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const maxWidth = 250;
    const maxHeight = 250;

    try {
        const image = await Jimp.read(req.file.path);
        await image.cover(maxWidth, maxHeight);
        await image.writeAsync(req.file.path);
        next();
    } catch (error) {
        next(error);
    }
};

const upload = (req, res, next) => {
    const uploadMiddleware = multer({
        storage,
        limits,
    }).single("avatar");

    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: "File too large" });
        } else if (err) {
            return res.status(500).json({ error: "Something went wrong" });
        }

        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        avatarProcessor(req, res, next);
    });
};

export default upload;
