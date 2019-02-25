const app = require('http').createServer()
const pin = require('./pin');
const io = require('socket.io')(app)
const LENGTH = 2;

const sending_port = 4000;
app.listen(sending_port);
let counter = 0;
let socket_ids = 0;
//generate pin and create hash
const pin_from_server = pin.generatePIN();

//to be commented out
var alert = "Generate PIN " + pin_from_server;
console.log(alert);


function server_connection(shares){
  io.on('connection', function(socket) {
    socket.on('connected', function(pin_from_client){
      //Verify pin_from client with the hash if verified carry on else disconnect the client
      if(pin_from_client == pin_from_server){
        // console.log(socket.id);
        socket_ids += 1;
        if(socket_ids > LENGTH){
          socket.disconnect();
          io.close();
        }
      }
      else{
        console.log('Invalid PIN');
        socket.disconnect();
      }
    });

    socket.on('recieve_message', function(){
      io.to(socket.id).emit('send_file',{'domain': 'facebook', 'username': 'nandini', 'share_split': shares['shares'][counter], 'master_key_split':shares['not_shares'][counter]});
      counter += 1;
    });

    socket.on('disconnect', function(){
    console.log('1 client disconnected');
    });
  });
}

module.exports = {server_connection, counter};
