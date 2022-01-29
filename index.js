const express = require("express");
const mysql = require("mysql2");
const app = express();
const path = require("path");
const session = require("express-session"); // 전역으로 먹힘


const connection = mysql.createConnection({
    host : "localhost",
    port : 3306,
    user : "root",
    password : "1234",
    database : "test"
})

app.set("views", path.join(__dirname, "views")); //현재 폴더 + views 라는 폴더를 view의 기본 경로로 지정
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret : "dldnjsdn",
        resave : false,
        saveUninitialized : true,
        maxAge : 30000
    })
)


app.get("/", (req, res) =>{
    if(!req.session.signin){
        res.render("signin");
    }else{
        res.redirect("/main")
    }
})

app.post("/signin", (req,res)=>{
    let id = req.body.id;
    let password = req.body.password;
    // console.log(id, password);

    connection.query(
        `select * from user_list where post_id = ? && password = ?`,
        [id, password],
        (err, result) =>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                // console.log(result);
                if(result.length > 0){
                    req.session.signin = result[0]; 
                    // res.render("main", {
                    //     "name" : req.session.signin.name
                    // })
                    res.redirect("/main");
                }else{
                    res.send(`<script>alert("아이디 또는 비밀번호를 확인해주세요"); 
                    window.location.href="/"</script>`);
                    
                }
            }
        }
    )
})


app.get("/signup", (req, res)=>{
    res.render("signup");
})

app.post("/signup", (req,res)=>{
    let id = req.body.id;
    let password = req.body.password;
    let name = req.body.name;
    // console.log(id, password, name);
    connection.query(
        `select * from user_list where post_id =?`,
        [id],
        (err, result)=>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                if(result.length > 0){
                    res.send(`<script>alert("아이디가 존재합니다.");
                window.location.href="/"</script>`);
                }else{
                    connection.query(
                        `insert into user_list values (?, ?, ?)`,
                        [id, password, name],
                        (err2,result2)=>{
                            if(err2){
                                console.log(err2);
                                res.send(err2);
                            }else{
                                res.redirect('/')
                            }
                        }
                    )

                }
            }
        }
    )
    })
app.get("/update", (req,res)=>{
    res.render("update", {
      "id" :  req.session.signin.post_id,
      "password"  : req.session.signin.password,
      "name" : req.session.signin.name
    })
})

app.post("/update", (req, res) =>{
    let id = req.session.signin.post_id;
    let password = req.body.password;
    let name = req.body.name;

    connection.query(
        `update user_list set password = ?, name = ? where post_id =?`,
        [password, name, id],
        (err, result)=>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                req.session.signin.password = password;
                req.session.signin.name = name;
                res.redirect("/main");
            }
        }
    )

})

app.get("/main", (req, res)=>{
    res.render("main", {
        "id" : req.session.signin.post_id,
        "password" : req.session.signin.password,
        "name" : req.session.signin.name
    })
})

app.get("/signout", (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/");
        console.log(req.session);
    })
})

app.get("/delete", (req, res)=>{
    var id = req.session.signin.post_id;
    connection.query(
        `delete from user_list where post_id =?`,
        [id],
        (err, result) =>{
            if(err){
                console.log(err);
                res.send(err);
            }else{
                req.session.destroy( () =>{
                    console.log(req.session);
                    res.redirect("/");
                })
            }
        }
    )

})

const board = require("./routes/board")
app.use("/board", board)


const port = 3000;
app.listen(port, ()=> {
    console.log("서버 시작");
})