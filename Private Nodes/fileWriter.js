const fs = require('fs').promisees;
const folder = require('hidefile');

function createFolder(){
  let os_type = process.platform;
  //console.log(os_type);

  if(os_type == 'linux'){
      let dir = './.usernames';
      let dir2 = './.passwords';

      if (!fs.existsSync(dir)){
          fs.mkdirSync(dir);
        }
        if (!fs.existsSync(dir2)){
            fs.mkdirSync(dir2);
          }
      }

  //TO BE CHECKED
  else{
    if(os_type == 'win32'){
      var fsWin=require('fswin');
      var pathToFileOrDir='d:\\usernames\\';
      var attributes={
        	IS_ARCHIVED:false,//true means yes
        	IS_HIDDEN:true,//false means no
        	//IS_NOT_CONTENT_INDEXED:true,//remove this attribute if you don't want to change it
        	IS_OFFLINE:false,
        	IS_READ_ONLY:true,
        	IS_SYSTEM:false,
        	IS_TEMPORARY:false
        };
    }
  }
}

function writer_username(domain, username, password){
    //domain.file1
    //Username :  ID

    let user_key = 0;
    createFolder();
    fname = './.usernames/' + domain.concat(".username"); //change 'username'
    fs.exists(fname, (exist) => {
    	if(exist){
	        fs.readFile(fname, 'utf8', function readFileCallback(err, data){
    	        if (err) throw err;
    	        obj = JSON.parse(data); //now it an object
              let keys = [];
              for(x in obj) {console.log(x) ; keys.push(x);}
              obj[username] = keys.length + 1; //add some data
              user_key = obj[username];
    	        json = JSON.stringify(obj); //convert it back to json
    	        fs.writeFile(fname, json, 'utf8', (err) => {
		            if (err) throw err;
	            }); // write it back
            });
        }
        else{
            obj = {};
            obj[username] = 1; //add some data
            user_key = obj[username];
      	    json = JSON.stringify(obj); //convert it back to json
      	    fs.writeFile(fname, json, 'utf8', (err) => {
  		        if (err) throw err;
	        }); // write it back
        }
    });



    //ID : Password
    //domain.file2
    console.log("user_key value after changing" + user_key)
    let fname2 = './.passwords/' + domain.concat(".password");
    fs.exists(fname2, (exist) => {
    	if(exist){
	        fs.readFile(fname2, 'utf8', function readFileCallback(err, data){
    	        if (err) throw err;
    	        obj = JSON.parse(data); //now it an object
                let keys = [];
                for(x in obj) keys.push(x);
                if(user_key in keys)
                {
                  obj[user_key] = password;
                }
                else{
                obj[keys.length + 1] = password; //add some data
                }
    	        json = JSON.stringify(obj); //convert it back to json
    	        fs.writeFile(fname2, json, 'utf8', (err) => {
		            if (err) throw err;
	            }); // write it back
            });
        }
        else{
            obj = {};
            obj[1] = password; //add some data
    	    json = JSON.stringify(obj); //convert it back to json
    	    fs.writeFile(fname2, json, 'utf8', (err) => {
		        if (err) throw err;
	        }); // write it back
        }
    });
}

module.exports = { writer_username };
writer_username('facebook', 'nandini', 'password');
// writer_username('facebook', 'nandini_username', 'password2');
// writer_username('gmail', 'nandini', 'password');
// writer_username('gmail', 'nandini_gmail', 'password');
