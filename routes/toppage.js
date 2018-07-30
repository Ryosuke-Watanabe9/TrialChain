var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('toppage', {
    title: '影響調査ツール'
  })
})

module.exports = router