const express = require('express')
const qiniu = require('qiniu')
const app = express()
require('dotenv').config()
const port = 3000

app.post('/token', (req, res) => {
    const accessKey = process.env.ACCESS_KEY;
    const secretKey = process.env.SECRET_KEY;
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
        scope: process.env.BUCKET_NAME,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken=putPolicy.uploadToken(mac);
    
    res.send(uploadToken)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})