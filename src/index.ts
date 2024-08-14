import express from 'express'
import axios from 'axios'
import qiniu from 'qiniu'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()
const app = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const port = process.env.PORT

app.post('/api/token', (req, res) => {
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

app.post('/api/login', async (req, res) => {
  try {
    const { code } = req.body
    const url = 'https://api.weixin.qq.com/sns/jscode2session'
    const options = {
      appId: process.env.WX_APP_ID,
      secret: process.env.WX_APP_SECRET,
      js_code: code,
      grant_type: 'authorization_code'
    }
    const response = await axios.get(url, {params: options})
    console.log('res', response.data)
    res.send(response.data)
  } catch (error) {
    console.log(error)
    res.send(error)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})