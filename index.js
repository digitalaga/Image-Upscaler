const express = require('express');
const request = require('request');
const fs = require('fs');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(multer({ dest: 'uploads/' }).single('image'));

app.post('/enhance', (req, res) => {
  const apiKey = '2cfef2f1ede24fc595ea715c029444f6';
  const file = req.file;

  const formData = {
    image: {
      value: fs.createReadStream(file.path),
      options: {
        filename: file.originalname,
        contentType: file.mimetype,
      },
    },
  };

  request.post({
    url: 'https://www.cutout.pro/api/v1/photoEnhance',
    formData,
    headers: {
      'APIKEY': apiKey,
    },
    encoding: null,
  }, (error, response, body) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    } else {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(body);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
