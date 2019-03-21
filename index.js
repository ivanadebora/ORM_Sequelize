const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator/check'); //form validation
// const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params
// const multer  = require('multer'); //multipar form-data
// const path = require('path');
// const crypto = require('crypto');
const book = require('./models/book');


const app = express();
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(express.static('public'))

const port = process.env.PORT || 2000;

// const uploadDir = '/img/';
// const storage = multer.diskStorage({
//     destination: "./public"+uploadDir,
//     filename: function (req, file, cb) {
//       crypto.pseudoRandomBytes(16, function (err, raw) {
//         if (err) return cb(err)  

//         cb(null, raw.toString('hex') + path.extname(file.originalname))
//       })
//     }
// })

// const upload = multer({storage: storage, dest: uploadDir });

app.get('/', (req,res) => {
    res.send('<h1>Selamat datang di API!</h1>')
});

app.get('/book', (req, res) => {
    book.findAll().then(book => {
        res.json(book)
    })
});

app.post('/postbook', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    // upload.single('image'),

    //Set form validation rule
    check('image')
        .isLength({min:2}),
    check('name')
        .isLength({min: 2}),
    check('isbn')
        .isLength({ min: 5 })
        .isNumeric()
        .custom(value => {
            return book.findOne({where: {isbn: value}}).then(b => {
                if(b){
                    throw new Error('ISBN already in use');
                }            
            })
        }
    ),
    check('year')
        .isLength({min: 4, max: 4})
        .isNumeric(),
    check('author')
        .isLength({min: 2}),
    check('description')
     .isLength({min: 10})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    book.create({
        name: req.body.name,
        isbn: req.body.isbn,
        year: req.body.year,
        author: req.body.author,
        description: req.body.description,
        // image: req.file === undefined ? "" : req.file.filename
        image: req.body.image
    }).then(newBook => {
        res.json({
            "status":"success",
            "message":"Book added",
            "data": newBook
        })
    })
})

app.listen(port, () => console.log('Api aktif di port ' + port));

