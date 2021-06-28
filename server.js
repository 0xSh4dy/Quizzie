
const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const saltRounds=10;
var userPosition = "";
const connection_url = 'mongodb+srv://admin:BoAoAuyCcujHi0Ln@cluster0.qni0g.mongodb.net/NarutoDB?retryWrites=true&w=majority';
mongoose.connect(connection_url,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true});
const QuizUserSchema = mongoose.Schema({
    name:String,
    password:String,
    email:String,
    position:String
})
const QuizUsers = mongoose.model("quizuser",QuizUserSchema);
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Welcome to our site");
})
app.get("/login",function(req,res){
    res.send("Yes");
})

app.post("/mainScr/register",(req,res)=>{
    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        const newQuizUser = new QuizUsers({
            name:req.body.name,
            password:hash,
            email:req.body.email,
            position:req.body.position
        })
        newQuizUser.save();
    })
    
})
app.post("/mainScr/signin",(req,res)=>{
    QuizUsers.findOne({email:req.body.email},(err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            if(data===null){
                res.json({
                    auth:"No",
                    authPosition:"Invalid email"
                })
            }
            else{
                bcrypt.compare(req.body.password,data.password,(error,result)=>{
                    if(result===true && req.body.email===data.email &&req.body.name===data.name){
                        userPosition = data.position;
                        res.json({
                        auth:"Yes",
                        authPosition:data.position
                        })
                    }
                    else{
                        res.json({
                            auth:"No",
                            authPosition:"none"
                        })
                    }
                })
            }
        }
    })
})
app.get("/mainScr/authRenderer",(req,res)=>{
    res.send(userPosition);
})
app.get("/data",(req,res)=>{
    QuizUsers.find((err,data)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send(data);
        }
    })
})
app.listen(4000);