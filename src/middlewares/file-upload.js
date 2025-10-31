import multer from "multer";
import path from "path";
import fs from "fs";

//setup uploads directory
const uploadsFolder = "uploads";
if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

//configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsFolder);
  },

  filename: (req, file, cb) => {
    const name =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, name);
  },

});

//filter files
const fileFilter = (req, file , cb)=>{
    const allowed = /jpeg|jpg|png|gif/ ;

    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);

    if (extname && mimetype){      
        cb(null , true)
    } else{
        cb(new Error("Only images are allowed"));
    }
}

const upload = multer({
    storage,
    fileFilter,
});

export default upload;
