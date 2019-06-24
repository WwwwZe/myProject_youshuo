let upload = (req, res, next) => {
    const file = req.file;
    res.send({
        data: {
            path: "\\" + file.path
        },
        meta: {
            msg: "上传成功",
            status: 200
        }
    });
}

module.exports = upload