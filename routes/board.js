const express = require("express");
const router = express.Router();
const mysql = require("mysql2")
const moment = require("moment")

const connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "test"
})

router.get("/", (req, res)=>{
    connection.query(
        `select * from board`,
        (err, result)=>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                console.log(result);
                res.render("board",{
                    datas : result
                })
            }
        }
    )
})

router.get("/write", (req,res)=>{
    res.render("write.ejs")
})

router.post("/write", (req, res)=>{
    let title = req.body.title
    let post_id = req.session.signin.post_id
    let name = req.session.signin.name
    let content = req.body.content
    let time = moment().format("YYYY-MM-DD HH:mm:ss")

    connection.query(
        `insert into board (title, post_id, name, content, time)
        values (?,?,?,?,?)`,
        [title, post_id, name, content, time],
        (err, result)=>{
            if(err){
                console.log(err)
                res.send(err)
            }else{
                res.redirect("/board")
            }
        }
    )
})

router.get("/info", (req,res)=>{
    let no= req.query.No
    connection.query(
        `select * from board where No=?`,
        [no],
        (err, result)=>{
            if(err){
                console.log(err);
                res.send(err)
            }else{
                res.render("info",{
                    data : result[0],
                    post_id : req.session.signin.post_id
                })
            }
        }
    )
})

router.get("/delete", (req,res)=>{
    let no = req.query.No
    connection.query(
        `delete from board where No=?`,
        [no],
        (err, result)=>{
            if(err){
                console.log(err)
                res.send(err)
            }else{
                res.redirect("/board");
            }
        }
    )
})
module.exports = router;
