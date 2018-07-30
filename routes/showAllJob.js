var express = require('express')
var cytoscape = require('cytoscape')
var neo4j = require('neo4j-driver')
var util = require('./util')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('showAllJob', {
    title: 'search result',
    Job: req.body.JobID
  })
})

/* GET home page. */
router.get('/show', function (req, res, next) {
  var cy = cytoscape()
  var neo = neo4j.default
  var driver = neo.driver("bolt://localhost", neo.auth.basic("neo4j", "mhir"))
  var query = 'MATCH (Job)-[rel]-() RETURN Job,rel'
  var session = driver.session()

  session
    .run(query, {
    })
    //get node
    .then(results => {
      results.records.forEach(res => {
        cy.add({
          group: "nodes",
          data: {
            id: res.get('Job').identity.low,
            name: res.get('Job').properties.JobID,
            weight: util.getWeight(res.get('Job').properties.Type),
            faveColor: util.getColor(res.get('Job').properties.SystemNo),
            faveShape: util.getShape("normal"),
            cycle: res.get('Job').properties.Cycle,
            operatingTime: res.get('Job').properties.OperatingTime,
            comment: res.get('Job').properties.Comment
          }
        })
      })
      results.records.forEach(res => {
        cy.add({
          group: "edges",
          data: {
            id: res.get('rel').identity.low + 10000,
            source: res.get('rel').start.low,
            target: res.get('rel').end.low,
            type: res.get('rel').type
          }
        })
      })
      session.close()
      driver.close()
      res.json(cy.elements().jsons())
    })
    .catch(function (error) {
      console.log(error)
    })
})

/* POST home page. */
router.post('/', function (req, res, next) {
})

module.exports = router