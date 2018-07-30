var express = require('express')
var cytoscape = require('cytoscape')
var neo4j = require('neo4j-driver')
var util = require('./util')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  var cy = cytoscape()
  var neo = neo4j.default
  var driver = neo.driver("bolt://localhost", neo.auth.basic("neo4j", "mhir"))
  var query = 'MATCH (errorJob:Job)-[rel*1..]->(nextJob) WHERE errorJob.JobID = $JobID RETURN errorJob,nextJob AS Job,rel'
  var session = driver.session()

  session
    .run(query, {
      JobID: req.query.JobID
    })
    //get node
    .then(results => {
      results.records.forEach(res => {
        cy.add({
          group: "nodes",
          data: {
            id: res.get('errorJob').identity.low,
            name: res.get('errorJob').properties.JobID,
            weight: util.getWeight(res.get('errorJob').properties.Type),
            faveColor: util.getColor(res.get('errorJob').properties.SystemNo),
            faveShape: util.getShape("normal"),
            cycle: res.get('errorJob').properties.Cycle,
            operatingTime: res.get('errorJob').properties.OperatingTime,
            comment: res.get('errorJob').properties.Comment
          }
        })
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
      results.records.map(records => {
        records.get('rel').forEach(resRel => {
          cy.add({
            group: "edges",
            data: {
              id: resRel.identity.low + 10000,
              source: resRel.start.low,
              target: resRel.end.low,
              type: resRel.type
            }
          })
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

//query total time of recovery
router.get('/showTotalTime', function (req, res, next) {
  var path = []
  var neo = neo4j.default
  var driver = neo.driver("bolt://localhost", neo.auth.basic("neo4j", "mhir"))
  var query = 'MATCH (from)-[rel*1..]->(to:Job) WHERE from.JobID = $JobID and to.JobID = $endJobID RETURN rel,REDUCE(totalMinutes = 0, s in rel | totalMinutes + s.Time) as totalTime ORDER BY totalTime DESC LIMIT 1'
  var session = driver.session()

  session
    .run(query, {
      JobID: req.query.jobInfo[0],
      endJobID: req.query.jobInfo[1]
    }).then(results => {
      path = []
      results.records.forEach(res => {
        path.push(res.get('totalTime').low)
        //get relationship
        res.get('rel').forEach(resRel => {
          var rel = {
            id: resRel.identity.low,
            source: resRel.start.low,
            target: resRel.end.low,
          }
          path.push(rel)
        })
      })
      session.close()
      driver.close()
      res.json(path)
    })
})
/* POST home page. */
router.post('/', function (req, res, next) {
  res.render('result', {
    title: 'search result',
    errorJob: req.body.JobID,
  })
})

module.exports = router