const fs = require('fs');

function reader(fname){
    fname1 = fname.concat(".username");
    fs.readFile(fname1, 'utf-8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj);
    });
    fname2 = fname.concat(".password");
    fs.readFile(fname2, 'utf-8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        console.log(obj);
    });
}


module.exports = { reader };
reader('./.usernames/facebook');
