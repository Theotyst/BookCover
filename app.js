var express = require('express');
var app = express();
var server = require('http').createServer(app);
var	io = require('socket.io').listen(server);

var fs = require('fs');
var mysql = require('mysql');

var mySqlClient = mysql.createConnection({
  host     : "0.0.0.0",
  user     : "thibaultlinglain",
  password : "",
  database : "c9"
});


io.on('connection', function(socket){ 
	
  
	socket.on('access', function(code){
		var query = "SELECT current FROM codes WHERE code = "+code;
		mySqlClient.query(query, function select(error, results, fields) {
		    if (error) {
		      console.log(error);
		      mySqlClient.end();
		      return;
		    }
		 
		    if (results.length > 0)  { 
		    
		      var firstResult = results[0];
		      var file = firstResult['current'];
			  socket.emit('msg', 'connected : '+file);
			  socket.emit('connected');
			  connectionSuccess();
			  loadScene(file);
   		    } else {
		      socket.emit('msg', 'Wrong code');
		    }
    	});
	});

	var connectionSuccess = function(){
		socket.on('test', function(){
			socket.emit('msg', "data");
		});
	}

	var loadScene = function(fileName){
		fs.readFile('scenes/'+fileName, 'utf8', function (err,data) {
  			if(err){
    			return console.log(err);
  			}
  			socket.emit('loadScene', JSON.parse(data));
		});
	}
	
});

app.set('port', process.env.PORT || 9090);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});