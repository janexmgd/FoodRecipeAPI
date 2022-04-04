const multer = require('multer')
const path = require('path')
const {
    failed
} = require('../helpers/response')
// manajemen file
const multerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public')
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            const filename = `${Date.now()}${ext}`
            cb(null, filename)
        }
    }),
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (file.fieldname === 'photo') {
            if (!['.jpg', '.png'].includes(ext)) {
                return cb(new Error('Only images with jpg and png are allowed'));
            }
            if (file.size > 2097152) {
                return cb(new Error('File size exceeds 2 MB'));
            }
        }
        if (file.fieldname === 'video') {
            if (!['.mp4'].includes(ext)) {
                return cb(new Error('Only mp4 are allowed'));
            }
        }
        cb(null, true);
    }
})

// middleware
const upload = (req, res, next) => {
    const multermultiUpload = multerUpload.fields([{
        name: 'photo',
        maxCount: 1
    }, {
        name: 'video',
        maxCount: 1
    }]);
    multermultiUpload(req, res, (err) => {
        if (!req) {
            next()
        }
        if (err) {
            failed(res, err.message, 'failed', 'failed upload file')
        } else {
            next()
        }
    })
}

module.exports = upload