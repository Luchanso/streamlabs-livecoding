const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const app = express()

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirect = process.env.HOST + 'auth'
const state = 'random_state' // :D

let access_token
let refresh_token
let access_expire

process.env.PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hi! Can you don\'t touch this pls? Just close. <a href="/login">Authorize</a>')
})

app.get('/auth', (req, res) => {
  let code =  req.query.code

  let formData = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect,
    client_id: clientId
  }

  request.post(`https://${clientId}:${clientSecret}@www.livecoding.tv/o/token/`, {
    formData: formData,
  }, (err, resp, body) => {
    access_token = JSON.parse(body).access_token

    getFollowers(res)
  })
})

app.get('/login', (req, res) => {
  let host = `https://www.livecoding.tv/o/authorize/?response_type=code&client_id=${clientId}&state=${state}`

  res.redirect(host)
})

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})

function getFollowers(res) {
  request.get('https://www.livecoding.tv/api/user/livestreams/', {
    'auth': {
      'bearer': access_token
    }
  }, (err, resp, body) => {
    let str = JSON.stringify({
      err: err,
      resp: resp,
      body: body
    })

    console.log(str)
    res.send(str)
  })
}
