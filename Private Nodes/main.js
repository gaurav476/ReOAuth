const encrypt = require('./encrypt')
const server = require('./server')
// const decrypt = require('./decrypt')
// const fileReader = require('./fileReader')
// const fileWriter = require('./fileWriter')

let shares = encrypt.encrypt_and_split('mypassword', 5, 10);
console.log(shares);
server.server_connection(shares);
