const AssetManager = require('./assetManager.js').AssetManager;
const assetManager = new AssetManager('passModel');

/**
 * format
 * ------
 * data = { 'facebook.com;xyz.gmail.com': 'password_fb_xyz',
            'facebook.com;abc.gmail.com': 'password_fb_abc',
            'gmail.com;abc.gmail.com': 'password_gmail_abc' };
 */
async function saveId(domain, id, pass) {

  try {
    let ids = await assetManager.retrieveAssets();
    const key = domain+';'+id;
    ids = JSON.parse(ids);
    ids[key] = pass;

    await assetManager.createAsset(ids);
  } catch(e) {
    let ids = {};
    const key = domain+';'+id;
    ids[key] = pass;

    await assetManager.createAsset(ids);
  }

}

async function getAllAccountDetails() {
  try {
    let ads = await assetManager.retrieveAssets();
    ads = JSON.parse(ads);
    return ads;
  } catch(e) {
    return {};
  }
}

async function getIds() {
  try {
    let ids = await getAllAccountDetails();
    return Object.keys(ids);
  } catch(e) {
    return {};
  }
}

// async function main() {

//   await saveId('yahoo', 'xyz.yahoo.com', 'password2New');
//   let accDl = await getAllAccountDetails();
//   console.log(accDl);
//   let ids = await getIds();
//   console.log(ids);
// }

// main();
