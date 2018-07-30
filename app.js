// import package
var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')

// routing
var index = require('./routes/index')
var toppage = require('./routes/toppage')
var result = require('./routes/result')
var showAllJob = require('./routes/showAllJob')

// start app server
var app = express()

// set static directory
app.use(express.static("public"))

// set view propaty
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// handle json request
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routing
app.use('/', toppage)
app.use('/result', result)
app.use('/showAllJob', showAllJob)

var server = app.listen(3200, function(){
    console.log("Node.js is listening to PORT:" + server.address().port)
})

module.exports = app