const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

//set Storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "image/jgp" || file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            cb(null, 'uploads');
        } else {
            cb(new Error('Not Image'), null);
        }

    },
    filename: function (req, file, cb) {
        if (file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, file.originalname);
        } else {
            cb(null, file.originalname + '.' + 'jpeg');

        }
    }
});

var storageFile = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


var upload = multer({ storage: storage });
var uploadFile = multer({ storage: storageFile, limits: { fileSize: 1 * 1024 * 1024 } });

// Get Url
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/upload.html');
})

app.post('/uploadfile', uploadFile.single('myFile'), (req, res, next) => {
    const file = req.file;
   
    if (!file) {
        const error = new Error('Vui long chọn file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);

})
app.post('/uploadMultipleFile', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files;
    if (!files) {
        const error = new Error('Vui long chọn file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(files);
})

app.listen(3000);