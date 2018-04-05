var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var methodOverride = require('method-override')
var cors = require('cors');
 
var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

app.get('/posts', function(req, res) {
 
    res.json({"sucess": true});
 
});
 
app.listen(process.env.PORT || 8080);