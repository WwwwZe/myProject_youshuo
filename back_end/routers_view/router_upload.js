const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")
const uploadCont = require("../controllers_view/controller_upload")
const path = require("path")

//文件上传(先加载multer)
//使用 硬盘存储模式设置存放接收到的文件的路径及文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //接收到文件后输出的保存路径(不存在需要创建，没有下边创建文件夹函数就得手动添加文件夹)
        cb(null, "uploads/")
    },
    filename: function (req, file, cb) {
        //将保存文件名设置为事件戳+文件原名
        cb(null, Date.now() + "-" + file.originalname)
        // cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
//创建文件夹(选写)
const createFolder = function (folder) {
    try {
        //测试path制定的文件或目录的用户权限，我们用来检测文件是否存在
        //如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder);
    } catch (e) {
        //文件夹不存在，以同步的方式穿件文件目录
        fs.mkdirSync(folder);
    }
}
var uploadFolder = "uploads";
createFolder(uploadFolder);

//创建multer对象
const upload = multer({
    storage: storage
});
//路由
router.post("/upload", upload.single("pic"), uploadCont)

module.exports = router