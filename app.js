const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const app = express()

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const rederict = process.env.HOST + '/auth'

process.env.PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hello! <a href="/login">Authorize</a>')
  // request.post('https://www.livecoding.tv:443/api/user/followers/', {formData}, (err, resp, body) => {
  //   res.send(body)
  // })
})

app.get('/auth', (req, res) => {
  let code =  req.query.code

  let formData = {
    code: code,
    rederict_url: rederict,
    grant_type: 'authorization_code'
  }

  console.log(formData)

  request.post('https://www.livecoding.tv/o/token', {formData: formData}, (err, resp, body) => {
    console.log(body)
    res.send(body)
  })
})

app.get('/login', (req, res) => {
  let host = `https://www.livecoding.tv/o/authorize/?scope=read&redirect_uri=${rederict}&response_type=code&client_id=${clientId}`

  res.redirect(host)
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})
