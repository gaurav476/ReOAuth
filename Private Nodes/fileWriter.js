const fs = require('fs.promises');
const mkdirp = require('mkdirp');


function createFolder(){
  let os_type = process.platform;
  //console.log(os_type);

  if(os_type == 'linux'){
      let dir = './.usernames';
      let dir2 = './.passwords';
      mkdirp(dir, function(err) {
        console.log(err);
      });
      mkdirp(dir2, function(err) {
        console.log(err);
      });
    }

  //TO BE CHECKED
  // else{
  //   if(os_type == 'win32'){
  //     var fsWin=require('fswin');
  //     var pathToFileOrDir='d:\\usernames\\';
  //     var attributes={
  //       	IS_ARCHIVED:false,//true means yes
  //       	IS_HIDDEN:true,//false means no
  //       	//IS_NOT_CONTENT_INDEXED:true,//remove this attribute if you don't want to change it
  //       	IS_OFFLINE:false,
  //       	IS_READ_ONLY:true,
  //       	IS_SYSTEM:false,
  //       	IS_TEMPORARY:false
  //       };
  //   }
  // }
}
function random(low, high) {
  return Math.random() * (high - low) + low
}

async function writer_username(domain, username, password){
    //domain.file1
    //Username :  ID

    let user_key = 0;
    let keys = [];
    createFolder();
    let fname = './.usernames/' + domain.concat(".username"); //change 'username'

    let exists = await fs.exists(fname);

    if(exists) {
        let data = await fs.readFile(fname, 'utf8');

        obj = JSON.parse(data); //now it an object
        for(x in obj) {console.log(obj[x]) ; keys.push(obj[x]);}
        
        //obj[username] = random(0,10); //add some data
        user_key = new Buffer(username).toString('hex');
        obj[username] = user_key;
        json = JSON.stringify(obj); //convert it back to json

        await fs.writeFile(fname, json, 'utf8');
    } else{
          obj = {};
          user_key = new Buffer(username).toString('hex');
          obj[username] = user_key;
          json = JSON.stringify(obj); //convert it back to json

          await fs.writeFile(fname, json, 'utf8');
    }


    //ID : Password
    //domain.file2
    console.log("user_key value after changing" + user_key)


    let fname2 = './.passwords/' + domain.concat(".password");
    console.log(fname2);
    exists = await fs.exists(fname2);
    console.log(exists);
    if(exists) {
      data = await fs.readFile(fname2, 'utf8');
      obj = JSON.parse(data); //now it an object
      console.log("dgs" + user_key);
      if(user_key in keys){
        console.log("  qwertyui"+keys)
      }
      obj[user_key] = password;
      json = JSON.stringify(obj); //convert it back to json
      await fs.writeFile(fname2, json, 'utf8');
    } else{
          obj = {};
          obj[user_key] = password; //add some data
        json = JSON.stringify(obj); //convert it back to json
        await fs.writeFile(fname2, json, 'utf8');
      }
}

module.exports = { writer_username };
writer_username('facebook', 'nandini', 'password');
