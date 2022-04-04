const {
    failed
} = require("../helpers/response")
const auth = (req, res, next) => {
    // console.log(token);
    const token = req.headers.token
    // console.log(token);
    if (token && token === 'qwerty') {
        next()
    } else {
        failed(res, null, 'failed', 'invalid token')
    }
}
module.exports = auth