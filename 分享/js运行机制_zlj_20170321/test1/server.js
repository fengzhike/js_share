var express = require('express')
var app = express()
 
app.use(express.static(__dirname)).listen(3001,()=>console.log('可以访问了'))
