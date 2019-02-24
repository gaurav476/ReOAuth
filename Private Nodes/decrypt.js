const crypto = require('crypto');
const sss = require('shamirs-secret-sharing')
const keys = require('./encrypt')

function decrypt_and_combine(shares)
{
  const recovered = sss.combine(shares.slice(2, 7)); //Taking 4 splits to combine. Randomize this.
  let recovered_string = recovered.toString();
  let mykey = crypto.createDecipher('aes-256-cbc', 'mypassword');
  let mystr = mykey.update(recovered_string, 'hex', 'utf8') + mykey.final('utf8');
  return mystr;
}

// let shares = keys.encrypt_and_split('nandini', 5, 10);
// let x = decrypt_and_combine(shares);
// console.log(x)
