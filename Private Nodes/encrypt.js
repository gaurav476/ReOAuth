const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');

function encrypt_and_split(encryption, threshold_value, share_key_value)
{
  let mykey = crypto.createCipher('aes-256-cbc', 'mypassword');
  let mystr = mykey.update(encryption, 'utf8', 'hex') + mykey.final('hex');
  const secret = Buffer.from(mystr)
  const shares = sss.split(secret, { shares: share_key_value, threshold: threshold_value })
  // console.log(mystr);
  return shares;
}

module.exports = {encrypt_and_split};

// encrypt_and_split('nandini', 5, 10);
