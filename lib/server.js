import express from 'express';
import bodyParser from 'body-parser';
import appRoot from 'app-root-path';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const viewsPath = appRoot + '/views/';
const assetsPath = appRoot + '/assets/uploads/';

app.use(express.static('public'));
app.use(fileUpload());
app.use(cookieParser());

app.get('/', (req, res) => {
  console.log("Cookies: ", req.cookies);
  console.log('Got a GET request for the homepage');
  res.sendFile(viewsPath + 'index.html');
});

app.post('/process_post', urlencodedParser, (req, res) => {
   // Prepare output in JSON format

   const response = {
      first_name:req.body.first_name,
      last_name:req.body.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
});

app.get('/file_upload', (req, res) => {
  res.sendFile(viewsPath + 'file_upload.html');
});

app.post('/file_upload', (req, res) => {
  if (!req.files){
    return res.status(400).send('No files were uploaded.');
  } else {
    console.log(req.files.file);
    const file = req.files.file;
    file.mv(assetsPath + file.name, (err) => {
      if (err) return res.status(500).send(err);
      res.send('File Uploaded!');
    });
  }
});

app.get('/process_get', (req, res) => {
  const response = {
    first_name: req.query.first_name,
    last_name: req.query.last_name
  };
  console.log(response);
  res.end(JSON.stringify(response));
});

const server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
