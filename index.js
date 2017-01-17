var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var mysql = require('mysql');
var dbConf = require('./conf.js');

var mcon = mysql.createConnection(dbConf);

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

mcon.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + mcon.threadId);
});


app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());

var port = 1234;

var router = express.Router();


router.get('/skills/:i', function(req,res) {
  let classTitle = toTitleCase(req.params.i.toString());
  let sql1 = "SELECT skill_name, baseCost FROM skill_cost sc LEFT JOIN skills s ON sc.skill_id = s.skill_id WHERE sc.class_id = ";
  let sql2 = "(SELECT class_id FROM classes WHERE class_name = "+mcon.escape(classTitle)+")";
  
  mcon.query(sql1+sql2, function(error, result, fields) {
    if (error) throw error;
    res.send(result);
  })
});

router.get('/patterncost/:i', function(req,res) {
  let classTitle = toTitleCase(req.params.i.toString());
  let sql1 = "SELECT pattern_name, pattern_cost FROM patterns pc LEFT JOIN pattern_classes p ON pc.pattern_id = p.pattern_id WHERE class_id = ";
  let sql2 = "(SELECT class_id FROM classes WHERE class_name = "+mcon.escape(classTitle)+")";
 
  
  mcon.query(sql1+sql2, function(error, result, fields) {
    if (error) throw error;
    res.send(result);
  })
});


router.get('/classes', function(req,res) {
  
  let sql = "SELECT class_id AS id, class_name AS name FROM classes";
  
  mcon.query(sql, function(error, result, fields) {
    if (error) throw error;
    res.send(result);
  })
})

router.get('/patterns', function(req,res) {
  
  let sql = "SELECT pattern_id AS id, pattern_name AS name FROM patterns";
  
  mcon.query(sql, function(error, result, fields) {
    if (error) throw error;
    res.send(result);
  })
})



router.get('/', function(req, res) {
  res.json({message: "Imperial EQ API"});
});

app.use('/', router);

app.listen(port);

