const crypto = require('crypto');
const sss = require('shamirs-secret-sharing');

function encrypt_and_split(encryption, master_key, threshold_value, share_key_value)
{
  let mykey = crypto.createCipher('aes-256-cbc', 'mypassword');
  let notmykey = crypto.createCipher('aes-256-cbc', 'mypassword');
  let mystr = mykey.update(encryption, 'utf8', 'hex') + mykey.final('hex');
  let notmystr = notmykey.update(master_key, 'utf8', 'hex') + notmykey.final('hex');

  const secret = Buffer.from(mystr)
  const notsecret = Buffer.from(notmystr)
  const shares = sss.split(secret, { shares: share_key_value, threshold: threshold_value })
  const notshares = sss.split(notsecret, { shares: share_key_value, threshold: threshold_value })
  // console.log(mystr);
  return {'shares' : shares, 'not_shares': notshares};
}

module.exports = {encrypt_and_split};

// encrypt_and_split('nandini', 5, 10);
