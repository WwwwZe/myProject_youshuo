const jwt = require('jsonwebtoken');
const verificationToken = (req, res, next) => {
    if(req.url=="/login") return next();
    const token = req.headers.authorization
    // 密匙验证
    jwt.verify(token, 'my_token', function (err, data) {
        var data
        if (err) {
            data={
                data: null,
                meta: {
                    msg: "token验证失败",
                    status: 401
                }
            }
            return res.send(data);
        }
        // console.log('token验证成功')
        next()
      })
}
module.exports = verificationToken