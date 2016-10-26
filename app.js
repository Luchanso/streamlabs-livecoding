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
let followers

const timeUpdate = 5000

process.env.PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('Hi! Can you don\'t touch this pls? Just close. <a href="/login">Authorize</a>')
})

app.get('/auth-livecoding', (req, res) => {
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

    res.send('All ok')

    setInterval(timeUpdate, update)
  })
})

app.get('/auth-streamlabs', (req, res) => {
  let code =  req.query.code

  console.log(code)
}

app.get('/login-livecoding', (req, res) => {
  let host = `https://www.livecoding.tv/o/authorize/?response_type=code&client_id=${clientId}&state=${state}`

  res.redirect(host)
})

app.get('/login-streamlabs', (req, res) => {

}

app.listen(process.env.PORT, function () {
  console.log(`Example app listening on port ${process.env.PORT}!`)
})

function update() {
  getFollowers(error, arr => {
    if (followers == null) {
      followers = arr
    }

    if (followers.length !== arr.length) {
      return
    }

    let difference = getDifference(followers, arr)
  })
}

function error(msg) {
  console.error(msg)
}

function getDifference(arr1, arr2) {
  let difference = []
  let bigger, smaller

  if (arr1.length > arr2.length) {
    bigger = arr1
    smaller = arr2
  } else {
    bigger = arr2
    smaller = arr1
  }

  for (let i = 0; i < bigger.length; i++) {
    let find = false

    for (let j = 0; j < smaller.length; j++) {
      if (bigger[i].username === smaller[j].username) {
        find = true
        break
      }
    }

    if (!find) {
      difference.push(bigger[i])
    }
  }

  return difference
}

function getFollowers(error, callback) {
  request.get('https://www.livecoding.tv/api/user/followers/', {
    'auth': {
      'bearer': access_token
    }
  }, (err, resp, body) => {
    if (err != null) {
      error(err)
    } else {
      callback(JSON.parse(body))
    }
  })
}

module.exports = {
  getDifference: getDifference
}
