/*
 * Developer: Shivam Gangwar
 * Maintainer: Gaurav
 * Date: 19 Feb 2019
 */

const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const storage = require("node-persist");

//just replace this call with our security algorithm
var crypto = require("crypto");

var sha1 = require('sha1');
//allow for variable storage --> security feature
storage.initSync();

const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const Reset = "\x1b[0m"
const Blink = "\x1b[5m"

var argv = require("yargs").command('create','Create an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        password:{
            demand: true,
            alias: 'p',
            description: 'Your password goes here',
            type: 'string'
        },

        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('update','Update an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        password:{
            demand: true,
            alias: 'p',
            description: 'Your new password goes here',
            type: 'string'
        },

        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('delete','Delete an account',function(yargs){
    yargs.options({
        name:{
            demand: true,
            alias: 'n',
            description:'Your Domain goes here',
            type: 'string'
        },
        username:{
            demand: true,
            alias: 'u',
            description: 'Your username goes here',
            type:'string'
        },
        // Replace with OTP
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('list','list all accounts',function(yargs){
    yargs.options({
        masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here (To be replaced with OTP)',
            type: 'string'
        }
    })
.help('help');
}).command('get', 'Get your account information', function(yargs){
          yargs.options({
              name: {
                  demand: true,
                  alias: 'n',
                  description: 'Your account name goes here',
                  type: 'string'
              },
            masterpassword:{
            demand: true,
            alias: 'm',
            description: 'Enter the master decrytion password here',
            type: 'string'
        }
          }).help('help');
    })
   .help('help')
   .argv


var command = argv._[0];

//account will have a name ie. Facebook
//account will have a username ie.vinaceto@yahoo
//account will have a password ie. password123


// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.appdata'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.


const TOKEN_PATH = 'token.json';


function run(credentialsFileName){

  // Load client secrets from a local file.
  fs.readFile(credentialsFileName, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
      // Authorize a client with credentials, then call the Google Drive API.
      authorize(JSON.parse(content), authorizedCallback);
  });

}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile('persist/'+TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/*
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('[ALERT] Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('\n[INPUT] Enter the code from that page here: ', (code) => {
    rl.close();
     oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);

      // Store the token to disk for later program executions
      return new Promise(function(resolve, reject){
      fs.writeFile('persist/'+TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) reject(err);
          else resolve(); 
        });
      }).then(function(oAuth2Client){
            console.log("[SUCCESS] Token is stored at 'persist/token.json'");
            //Calling main function where all the operations will be done.
            callback(oAuth2Client);
      }).catch(function(err) {
            console.log("[ERROR] Error here: " + err);
      });        

    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function authorizedCallback(auth) {
  const drive = google.drive({ version: 'v3', auth});  
  
/*  
  searchFileInGdrive(drive,'facebook').then(data => {
    console.log(data);
  }).then(() => {
    console.log("SEARCH RESULT :");    
  })  
*/

//listFiles(drive);

/*
deleteDomainFromGoogleDrive(drive,'facebook').then(deleteResult => {
  listFiles(drive);
}).catch(e => {
  console.log("[ERROR]",e);
});
*/



/*
downloadFileFromAppDataFolder(drive,'uohyd1').then(downloadResult => {
  if(downloadResult === 'downloadComplete'){
    console.log("[RESULT] -", downloadResult);
  }
}).catch(e => {
  console.log("[DOWNLOAD_ERROR]",e);
});
*/

//deleteAccount("shivam");


  if(command === 'create'){
    console.log("\nUploading Process Initiated...")
          createAccountOnGdrive(drive,{
              name: argv.name,
              username: argv.username,
              password: argv.password,
          },argv.masterpassword).then(createdAccountsStautsCode => {
            if(createdAccountsStautsCode === "ALREADY_EXISTS"){
              console.log(BgGreen+"["+createdAccountsStautsCode+"]"+Reset+"Account! Nothing changes to Gdrive");  
            }
            else if(createdAccountsStautsCode === "UPLOADED_SUCCESSFULLY"){
            console.log(BgGreen+"["+createdAccountsStautsCode+"]"+Reset+" - Account Created and uploaded to Gdrive!");       
            }
          }).catch(e => {
            console.log("Unable to create account!",e.message);
          });

  }else if(command === 'get'){
        getAccountsFromGdrive(drive,sha1(argv.name), argv.masterpassword).then(grabbedAccount => {
          if( grabbedAccount === 'FileNotFound'){
            console.log(BgGreen+"[SUCCESS]"+Reset+"Account not found!");
          }else{
            console.log(BgGreen+"[SUCCESS]"+Reset+"Account(s) Found ....");
            printAccounts(grabbedAccount);
          }  
        }).catch(e => {
          console.log(BgRed+"[ERROR]"+Reset+" Unable to fetch desired account!",e.message);
        });
  }else if(command === 'delete'){
      try{
          let afterDeleteAccounts = deleteAccount(argv.name,argv.username,argv.masterpassword);
          if( afterDeleteAccounts.length == 0){
              deleteAllAccount(argv.name);
          }
          console.log(BgGreen+"[SUCCESS]"+Reset+"Account Deleted ....");
          if( afterDeleteAccounts.length > 0){        
              printAccount(afterDeleteAccounts);
          }
      }catch (e){
          console.log(BgRed+"[ERROR]"+Reset+"Unable to delete account!"+e.message);
      }
  }else if(command === 'update'){
     try{
          var afterUpdateAccounts = updateAccount({
              name: argv.name,
              username: argv.username,
              password: argv.password,
          }, argv.masterpassword);
          
          console.log(BgGreen+"[SUCCESS]"+Reset+"[SUCCESS] Account Updated!");
          printAccount(afterUpdateAccounts);
      }catch (e){
          console.log(BgRed+"[ERROR]"+Reset+"Unable to Update account!"+e.message);
      }
  }else if(command === 'list'){
     try{
          listFiles(drive);
      }catch (e){
          console.log(BgRed+"[ERROR]"+Reset+"Unable to List All Accounts!");
      }
  }
}

function createAppDataFolder(drive) {
  console.log('Creating AppDataFolder');
  const fileMetadata = {
    'name': '_init',
    'parents': ['appDataFolder']
  };
  drive.files.create({
    resource: fileMetadata,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.log("[ERROR] AppDataFolder is not created !!!");
      console.error(err);
    } else {
      console.log('[SUCCESS] Created Folder Id:', file.data.id);
    }
  });
}


function updateFileInToAppDataFolder(drive,fileName){

    downloadFileFromAppDataFolder(drive,fileName);
    deleteAccountFromGoogleDrive(drive,fileName);
    //insertFileInToAppDataFolder(drive,fileName);
}


function uploadFileToDrive(drive,fileName){
  return new Promise(function(resolve, reject){
      const fileMetadata = {
        'name': fileName,
        'parents': ['appDataFolder']
      };
      const media = {
        mimeType: 'application/json',
        body: fs.createReadStream('persist/'+fileName)
      };
      drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function (err, file) {
        if (err) {
          reject(err);
          console.error(err);
        }else {
          resolve(file.data.id);
        }
      });
   });
}


function createAccountOnGdrive(drive,account,key){
  fileName = sha1(account.name);
  return new Promise(function(resolve, reject){ 
     searchFileInGdrive(drive,fileName).then(searchResult => {
      console.log("Search Result:",searchResult);
      if(searchResult === 'FileNotFound'){
        let accounts = createAccount(account,key);
        console.log("---[NEW ACCOUNT]---");
        printAccounts(accounts);
        console.log("\nFile created in local directory now uploading...");
        uploadFileToDrive(drive,fileName).then(uploadResult => {
          //deleteAllAccount(fileName);
          resolve("UPLOADED_SUCCESSFULLY" );
        }).catch(e => {
          console.log('[ERROR] File not uploaded successfully!\n  ---[WARNING] NOT DELETED FROM LOACL DIRECTORY !');
          reject(e);
        });
      }else{
        downloadFileFromAppDataFolder(drive,fileName).then(downloadResult => {
          console.log("---OLD ACCOUNT---");
          if(downloadResult === 'downloadComplete'){
            console.log("--File downloaded in local directory");
            beforeAcountLength = getAccounts(fileName,key).length;
            let createdAccounts = createAccount(account,key); 
            if(beforeAcountLength !== createdAccounts.length){
              console.log("----ACCOUNTS after adding new account");
              printAccounts(createdAccounts);
              deleteDomainFromGoogleDrive(drive,fileName).then(deleteResult => {
                console.log("\n","\x1b[42m"+"[SUCCESS]"+"\x1b[0m"+ " | DeleteResult : "+ deleteResult +"ed from Gdrive! ");
                
                uploadFileToDrive(drive,fileName).then(uploadResult => {
                    //deleteAllAccount(fileName);
                    console.log("\nFile Uploaded to Gdrive with File-Id :",uploadResult);
                    resolve("UPLOADED_SUCCESSFULLY");
                  }).catch(e => {
                    console.log('[ERROR] File not uploaded successfully!\n  ---[WARNING] NOT DELETED FROM LOACL DIRECTORY !');
                    reject(e);
                  });
              });
            }else{
              //deleteAllAccount(fileName);
              resolve("ALREADY_EXISTS");
            }
          }
        }).catch(e => {
          reject(e);
        })
      }
    }).catch(e => {
      reject(e);
    })
  });
}

function downloadFileFromAppDataFolder(drive, fileName){
  return new Promise(function(resolve, reject){  
    searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult !== 'FileNotFound'){
        const dest = fs.createWriteStream('persist/'+fileName);
      
        drive.files.get({
        spaces: 'appDataFolder',
        fileId: searchResult,
        alt: 'media'
        }, 
        {responseType: 'stream'},
        function(err, res){
          res.data
            .on('end', () => {
              dest.end();
              resolve("downloadComplete");
            })
            .on('error', err => {
              console.log('Error', err);
              reject(err);
            })
            .pipe(dest);
        });
      }else{
        reject(searchResult);
      }
    });
  });  
}

function deleteDomainFromGoogleDrive(drive,fileName) {    
  return new Promise(function(resolve, reject){  
    searchFileInGdrive(drive,fileName).then(searchResult => {
      if(searchResult !== 'FileNotFound'){
        drive.files.delete({
            fileId: searchResult
        }, function (err, response) {
          if (err){
                reject(err);
                console.error(err);
          }else{
                resolve("deleted");                 
          }
        });
      }else{
        reject("File doesn't exists!");
      }
    });
  });   
}


function getAccountsFromGdrive(drive,fName,key){
  return new Promise(function(resolve, reject){ 
    searchFileInGdrive(drive,fName).then(searchResult => {
      console.log("searchResult:",searchResult);
      if(searchResult === 'FileNotFound'){
          console.log("Account does't Exists!");
          resolve(searchResult);
      }else{
        downloadFileFromAppDataFolder(drive,fName).then(downloadResult => {
          if(downloadResult === 'downloadComplete'){
            console.log("File downloaded in local directory");
            let grabbedAccount = getAccounts(fName,key);
            //deleteAllAccount(fileName);
            resolve(grabbedAccount);
          }          
        }).catch(e => {
          reject(e);
        });
      }
    }).catch(e => {
      reject(e);
    })
  }).catch(e =>{
    reject(e);
  })
}


function searchFileInGdrive(drive,fileName) {
  let found = false;
  return new Promise(function(resolve, reject){  
    drive.files.list({
      spaces: 'appDataFolder',
      fields: 'nextPageToken, files(id, name)',
      pageSize: 100
    }, function (err, res) {
      if (err) {
         reject(err);
         console.error(err);
      }
      else {
        let fileId = 'FileNotFound';
        res.data.files.forEach(function (file) {
          if(file.name === fileName){
              found = true;
              fileId = file.id;
              resolve(fileId);
          } 
        });
        if(found === false){
          resolve(fileId);
        }
      }
    });
  });
}


//will remove this function later (debugging only!)
function listFiles(drive) {
return new Promise(function(resolve, reject){  
  drive.files.list({
    spaces: 'appDataFolder',
    fields: 'nextPageToken, files(id, name)',
    pageSize: 100
  }, function (err, res) {
    if (err) {
      reject(err);
      console.error(err);
    } else {
      let i = 1;
      console.log("\nList of all Accounts on Gdrive...\n\n+--------------------------------------------------------------------------------------------------------------------+");
      console.log("|S.No\t\t\tHashed(fileName)\t\t\t\t\t\tFile-Id\t\t\t     |"); 
      console.log("+--------------------------------------------------------------------------------------------------------------------+");
     
      res.data.files.forEach(function (file) {
        if(file.name != '_init'){
        console.log('|',i++,'- \t', file.name,"         \t", file.id,'|');
      	}
      });
      console.log("+--------------------------------------------------------------------------------------------------------------------+");
      resolve();
    }
  });
});

}


/*
function getAccounts(accountName,masterPassword){
  console.log("from getAccounts function accountName", accountName);
    var encryptedAccounts = storage.getItemSync(accountName);
    var accounts = [];

    if(typeof encryptedAccounts !== 'undefined'){
        //var decryptedAccounts = crypto.AES.decrypt(encryptedAccounts,masterPassword);
        accounts = encryptedAccounts;
    }
    console.log("accounts are..");
    printAccount(accounts);
    return accounts;
}

function saveAccounts(accountName, accounts, masterPassword){
    
    //var encryptAccounts = crypto.AES.encrypt(JSON.stringify(accounts),masterPassword);
    //console.log('encryptedAccounts : ',encryptedAccounts);
    storage.setItemSync(accountName, accounts);
    return accounts;
}


function createAccount(account, masterPassword){
    var accounts  = getAccounts(account.name,masterPassword);

    var found = false;
    for(var i = 0; i < accounts.length; ++i){
        if(account.username === accounts[i].username){
            found = true;
        }
    }
    if(!found){
        accounts.push(account);
        console.log("NEW ACCOUNT PUSHED INTO",account.name,"FILE");
        return saveAccounts(account.name,accounts,masterPassword);
    }else{
        console.log("ACCOUNT ALREADY IN",account.name,"FILE");
        return accounts;
    }    
}

function deleteAccount(account, masterPassword){
    var accounts  = getAccounts(account.name,masterPassword);
    var found = 999;
    for(var i = 0; i < accounts.length; ++i){
        if(account.username === accounts[i].username){
            found = i;
        }
    }
    if(found<accounts.length){

          accounts.splice(found,1);
          
          var eArr = accounts[Symbol.iterator]();
          for (let letter of eArr) {
            if(letter.username === account.username){
                accounts.splice(accounts.indexOf(letter),1);
            }
          }
        
        return saveAccounts(account.name,accounts,masterPassword);
    }else{
        return accounts;
    }    
}

function printAccount(accountsArray){
  console.log("----------------------------------------------");
  for(var i = 0; i < accountsArray.length; ++i){
    console.log(""+(i+1)+".\t",accountsArray[i].username,"\t",accountsArray[i].password);    
  }
  console.log("----------------------------------------------");
}

function deleteFile(fileName){
  try{
    fs.unlinkSync('persist/'+fileName)
    console.log('File removed from local drive');
  }catch(err) {
    console.log("Unable to delete the file from local directory!");
  }  
}
*/


function getAccounts(accountName,masterPassword){
    var encryptedAccounts = storage.getItemSync(accountName);
    var accounts = [];

    if(typeof encryptedAccounts !== 'undefined'){
        try{ 
            let cipher = crypto.createDecipher('aes-256-cbc', masterPassword);
            let decryptedAccounts = cipher.update(encryptedAccounts, 'hex', 'utf8') + cipher.final('utf8');
            accounts = JSON.parse(decryptedAccounts);
        }catch(exception){
            throw new Error(exception.message);
        }
    }
    return accounts;
}

function saveAccounts(accountName, accounts, masterPassword){
    try {
        var cipher = crypto.createCipher('aes-256-cbc', masterPassword);
        var encrypted = cipher.update(JSON.stringify(accounts), 'utf8', 'hex') + cipher.final('hex');
        storage.setItemSync(accountName, encrypted);
        return accounts;
    } catch (e) {
        throw new Error(e.message);
    }
}


function createAccount(account, masterPassword){
  try{
        accountName = sha1(account.name);
        var accounts  = getAccounts(accountName,masterPassword);
        var found = false;
        for(var i = 0; i < accounts.length; ++i){
            if(account.username === accounts[i].username){
                found = true;
            }
        }
        if(!found){
            accounts.push(account);
            return saveAccounts(accountName,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}


function updateAccount(account, masterPassword){
    try{   
        let accounts  = getAccounts(account.name,masterPassword);
        
        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(account.username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){
              accounts.splice(found,1);
              accounts.push(account);
            return saveAccounts(account.name,accounts,masterPassword);
        }else{
            return accounts;
        }
    }catch(e){
        throw new Error(e.message);
    }
}

function deleteAccount(accountName, username, masterPassword){
    try{
        let accounts  = getAccounts(accountName,masterPassword);
        let found = 999;
        for(let i = 0; i < accounts.length; ++i){
            if(username === accounts[i].username){
                found = i;
            }
        }
        if(found<accounts.length){

              accounts.splice(found,1);
              /*
              var eArr = accounts[Symbol.iterator]();
              for (let letter of eArr) {
                if(letter.username === account.username){
                    accounts.splice(accounts.indexOf(letter),1);
                }
              }
              */
            return saveAccounts(accountName,accounts,masterPassword);
        }else{
            return accounts;
        } 
    }catch(e){
        throw new Error(e.message);
    }   
}

function deleteAllAccount(domainName){
  try{
    fs.unlinkSync('persist/'+fileName)
    console.log(BgGreen+"[SUCCESS]"+Reset+'Domain Deleted!');
  }catch(err) {
    console.log(BgRed+"[ERROR]"+Reset+"Unable to delete the file from local directory!");
  }  
}


function printAccounts(accountsArray){
  console.log("------------------------------------------------------------");
  for(var i = 0; i < accountsArray.length; ++i){
    console.log(""+(i+1)+".\t",accountsArray[i].username,"\t",accountsArray[i].password);    
  }
  console.log("------------------------------------------------------------");
}

run('credentials.json');