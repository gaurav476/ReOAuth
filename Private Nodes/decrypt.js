const crypto = require('crypto');
const sss = require('shamirs-secret-sharing')
// const keys = require('./encrypt')

function decrypt_and_combine(shares)
{
  const recovered = sss.combine(shares['shares'].slice(2, 7)); //Taking 4 splits to combine. Randomize this.
  const recovered_masters = sss.combine(shares['not_shares'].slice(2, 7));
  let recovered_string = recovered.toString();
  let recovered_master_string = recovered_masters.toString();
  let mykey = crypto.createDecipher('aes-256-cbc', 'mypassword');
  let notmykey = crypto.createDecipher('aes-256-cbc', 'mypassword');
  let mystr = mykey.update(recovered_string, 'hex', 'utf8') + mykey.final('utf8');
  let notmystr = notmykey.update(recovered_master_string, 'hex', 'utf8') + notmykey.final('utf8');

  return {'password': mystr, 'master_key':notmystr};
}

// let shares = keys.encrypt_and_split('nandini', 'hello',  5, 10);
// let x = decrypt_and_combine(shares);
// console.log(x)
