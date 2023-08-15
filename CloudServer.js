// Main Vars
const express = require('express');
const app = express();
const port = 80;
const fs = require('fs');

// Functions
const GetFileTag = (FileName) => {
  return `<a style="text-decoration: underline; cursor:pointer; color:black;" target="_blank" href="./SavedFiles/${FileName}"}>File1</a>`
}

app.use(express.static('Client'));

// Backend
app.get('/submittxt', (req, res) => {
    const content = req.query.content;
    const name = req.query.name;
    fs.writeFile(`./SavedFiles/${name}.txt`, content, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Succesfully created new TXT file.")
        };
    });
});

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    message:"refresh"
  })
});

app.get('/getfiles', (req,res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
          console.log(err)
        };
        res.json({
          message:"success",
          array: files
        });
    });
});

app.get('/fetchfile', (req, res) => {
    const rs = fs.createReadStream(`./uploads/${req.query.filename}`);
    res.setHeader("Content-Disposition", `attachment; ${req.query.filename}`);
    rs.pipe(res);
});

app.listen(port, () => {
  console.log(`Cloud app listening on port ${port}`);
});
