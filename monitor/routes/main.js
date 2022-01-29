const express = require("express");
const router = express.Router();
const monment = require("moment");
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "test"
});

router.get("/", (req,res)=>{
    res.render("main")
})

router.get("/register", (req,res)=>{
    res.render("register");
})
router.post("/register", (req,res)=>{
    let name = req.body.name;
    let address = req.body.address;
    connection.query(
        `insert into farm(name, address) values (?,?)`,
        [name, address],
        (err, result)=>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                let sql = `create table farm_history_${name} (
                    No int auto_increment primary key,
                    farm_no int not null,
                    name varchar(45) not null,
                    temp int not null,
                    hud int not null,
                    date varchar(16) not null,
                    time varchar(16) not null
                )`
                connection.query(sql,
                    (err2, result2)=>{
                        if(err2){
                            console.log(err2);
                            res.send(err2);
                        }else{
                            res.redirect("/");
                        }
                    })
            }
        }
    )
})

router.get("/select", (req,res)=>{
    res.render("select");
})

router.get("/monitor", (req, res)=>{
    connection.query(
        `select * from farm`,
       (err, result)=>{
           if(err){
               console.log(err);
               res.json({
                   result:"error"
               })
           }else{
               res.json({ // db에서 가져온 data를 보낸다
                   result:result
               })
           }
       } 
    )
})

module.exports = router;