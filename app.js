const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const app = express()

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const rederict = process.env.HOST + 'auth'
const state = 'random_state' // :D

process.env.PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hi! Can you don\'t touch this pls? Just close. <a href="/login">Authorize</a>')
  // request.post('https://www.livecoding.tv:443/api/user/followers/', {formData}, (err, resp, body) => {
  //   res.send(body)
  // })
})

app.get('/auth', (req, res) => {
  let code =  req.query.code

  let formData = {
    grant_type: 'authorization_code',
    code: code,
    // rederict_url: rederict,
    state: state
  }

  request.post(`https://${clientId}:${clientSecret}@www.livecoding.tv/o/token/`, {
    formData: formData,
  }, (err, resp, body) => {
    let str = JSON.stringify({
      err: err,
      resp: resp,
      body: body
    })

    console.log(str)
    res.send(str)
  })
})

app.get('/login', (req, res) => {
  let host = `https://www.livecoding.tv/o/authorize/?redirect_uri=${rederict}&scope=read&response_type=code&client_id=${clientId}&state=${state}`

  res.redirect(host)
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})
