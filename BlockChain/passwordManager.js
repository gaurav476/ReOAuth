const AssetManager = require('./assetManager.js');
const assetManager = new AssetManager('passModel');

async function savePassword(domain, id, pass) {
  let ids = assetManager.retrieveAssets();

  console.log(ids);
}

async main() {

  await savePassword();
}

main();
