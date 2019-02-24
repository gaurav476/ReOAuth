var app = require('http').createServer()
// let client_conn = require('./client');
var io = require('socket.io')(app)

var port = 4000;
app.listen(port);
let socket_id = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let counter = 0;


io.on('connection', function(socket) {
  var alert = "Connection open at port " + port;
  // console.log(alert);
  // console.log(socket.id)

  // socket.emit('connect');

  socket.on('connected', function(ip_address){
    console.log("Client connected to " + ip_address);
    console.log(socket_id)
    });

  socket.on('recieve_message', function(){
    io.to(socket.id).emit('send_file',socket_id[counter] );
    counter += 1;
  });



    socket.on('disconnect', function(){
    console.log('1 client disconnected');
  });
});
