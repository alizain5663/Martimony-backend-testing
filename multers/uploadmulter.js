const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    if(file.originalname.split(".")[1]){
      cb(null, new Date().getTime() + "-" + file.originalname);
   
    }
    else{
      cb(null, new Date().getTime() + "-" + file.originalname+'.'+file.mimetype.split("/")[1]);
    }
  },
});
const upload = multer({
  storage: storage,
});

module.exports.upload = upload;