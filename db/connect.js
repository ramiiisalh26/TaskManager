
const mysql = require('mysql');

const con = mysql.createConnection({
    host: '68.66.226.894',
    user: 'yooopayn_RAMI_SALH',
    password: '##########',
    database:'yooopayn_RAMI_SALH'
})


con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected!");
    }
})

module.exports =  con;
