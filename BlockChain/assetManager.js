const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')
const Orm = require('bigchaindb-orm').default

const API_PATH = 'http://f91e4b85.ngrok.io/api/v1/'

const ID = { phrase: "Galileo_SIH_2019" }

class DID extends Orm {
    constructor(entity) {
        super(API_PATH)
        this.entity = entity
    }
}

module.exports.AssetManager = class AssetManager {

    constructor(assetType) {
        this.seed = bip39.mnemonicToSeed(ID.phrase).slice(0, 32)
        // FIX expected buffer error :
        this.userKeyPair = new BigchainDB.Ed25519Keypair(this.seed)

        this.conn = new BigchainDB.Connection(API_PATH, {})

        this.userDID = new DID(this.userKeyPair.publicKey)
        this.assetType = assetType;

        this.userDID.define(assetType, `https://schema.org/v1/${assetType}`)
    }

    async createAsset(data) {
        let asset = await this.userDID.models[this.assetType].create({
            keypair: this.userKeyPair,
            data: { 'ids' :  JSON.stringify(data) }
        });

        this.userDID.id = asset.id

        return asset;
    }

    async retrieveAssets() {
        // let retrievedAssets = await this.userDID
        //     .models
        //     .assetModel
        //     .retrieve(this.userDID.id);
        let retrieveAssets = await this.userDID.models[this.assetType].retrieve();
        return retrieveAssets[retrieveAssets.length-1].data.ids;
    }

    // async retrieveAssets() {
    //     let retrievedAssets = await Orm._connection.searchAssets(ID.phrase);
    //     return retrievedAssets;
    // }

    async updateAsset(updatedData) {
        let retrievedAssets = await this.retrieveAssets();

        if (retrievedAssets) {
            let updatedAssets = await retrievedAssets.concat({
                keypair: this.userKeyPair,
                data: updatedData
            })
        }

        // throw Error("Cannot Retrieve Assets!");
    }

    // async createAsset(data) {

    //     const txCreateAsset = BigchainDB.Transaction.makeCreateTransaction(
    //         data,
    //         null,

    //         // A transaction needs an output
    //         [ BigchainDB.Transaction.makeOutput(
    //             BigchainDB.Transaction.makeEd25519Condition(this.userKeyPair.publicKey))
    //         ],
    //         this.userKeyPair.publicKey
    //     )

    //     const txSigned = BigchainDB.Transaction.signTransaction(txCreateAsset,
    //         this.userKeyPair.privateKey)

    //     const asset = await this.conn.postTransactionCommit(txSigned);

    //     return asset;
    // }



    // async retrieveTransactionId(searchString) {
    //    this.conn.searchAssets(searchString)
    //         .then(assets => console.log('Found assets:', assets));
    // }
};


async function main() {
    let data = [
            { 'facebook.com;xyz.gmail.com': 'password_fb_xyz' },
            { 'facebook.com;abc.gmail.com': 'password_fb_abc' },
            { 'gmail.com;abc.gmail.com': 'password_gmail_abc' }
        ];

    // console.log('Creating Assets');
    // let am = new module.exports.AssetManager('testModel1');
    // let assets = await am.createAsset(data);
    // console.log('Assets Created: ');
    // console.log(assets);

    let am2 = new module.exports.AssetManager('testModel1');
    // data.push({ 'twitter.com;abc.gmail.com': 'password_twitter_abc' });

    // console.log('Updating Assets');
    // await am2.createAsset(data);
    // console.log('Assets Updated');

    console.log('Retrieving Updated Assets!');
    let rass = await am2.retrieveAssets();
    console.log("Assets Retrieved: ");
    console.log(rass[rass.length-1].data);

    // am2.retrieveTransactionId('BigchainBatmanDB');

}
try {
    main()
} catch(e) {
    console.log(e);
}
