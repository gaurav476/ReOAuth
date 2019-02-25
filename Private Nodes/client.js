var sock_mod = require('socket.io-client')
var ip = 'http://10.10.10.3:4000'; //IP of the server Resolve IP issue
var socket = sock_mod(ip)
var connected = "Connected to server " + ip;
// const ip_mod = require('ip');


function client_connection(pin_from_client){
  // socket.on('connect', function(){
  //     console.log(connected)})

  //send pin for verification
  console.log(pin_from_client)
  socket.emit('connected', pin_from_client);
  socket.emit('recieve_message')

  socket.on('send_file', function(data){
    console.log(data);  //next save it on the local device
    //fileWriter(data); //data in dictionary format
    if(data){
      socket.disconnect();
    }
  });
}

module.exports = {client_connection};
client_connection(07973849);

// 'use strict';
// function get_ip()
// {
//   var os = require('os');
//   var ifaces = os.networkInterfaces();
//   var address = []
//   Object.keys(ifaces).forEach(function (ifname) {
//     var alias = 0;
//
//     ifaces[ifname].forEach(function (iface) {
//       if ('IPv4' !== iface.family || iface.internal !== false) {
//         // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
//         return;
//       }
//
//       if (alias >= 1) {
//         // this single interface has multiple ipv4 addresses
//         //console.log(ifname + ':' + alias, iface.address);
//         address.push(iface.address);
//       } else {
//         // this interface has only one ipv4 adress
//         address.push(iface.address);
//         const netmask = iface.netmask;
//         console.log(ip_mod.or(iface.address, ip_mod.not(netmask)));
//       }
//       ++alias;
//     });
//   });
//   return(address);
// }
