const multer = require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        const uploadpath = './uploads'
        cb(null,uploadpath)
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+ '-' + file.originalname)
    }
});

const upload = multer({storage:storage})

module.exports = upload