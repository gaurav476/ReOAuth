var sock_mod = require('socket.io-client')
var ip = 'http://192.168.2.13:4000';
var socket = sock_mod(ip)
var connected = "Connected to server " + ip

let address = get_ip();
console.log(address)
client_connection(ip, connected);

function client_connection(ip, data){
  socket.on('connect', function(){
      console.log(connected)})

  socket.emit('connected', address)
  socket.emit('recieve_message')

  socket.on('send_file', function(data){
    console.log(data)
  });
}


'use strict';
function get_ip()
{

  var os = require('os');
  var ifaces = os.networkInterfaces();
  var address = []

  Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      if (alias >= 1) {
        // this single interface has multiple ipv4 addresses
        //console.log(ifname + ':' + alias, iface.address);
        address.push(iface.address)
      } else {
        // this interface has only one ipv4 adress
        //console.log(ifname, iface.address);
        address.push(iface.address)
      }
      ++alias;
    });
  });
  return(address);
}

module.exports = {client_connection};
