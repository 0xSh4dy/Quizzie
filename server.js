const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const saltRounds=10;
var userPosition = "";
var uName="";
var teacherEmail="";
var studEmail = "";
var studName="";
const connection_url = 'mongodb+srv://admin:BoAoAuyCcujHi0Ln@cluster0.qni0g.mongodb.net/NarutoDB?retryWrites=true&w=majority';
mongoose.connect(connection_url,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true});
const QuizUserSchema = mongoose.Schema({
    name:String,
    password:String,
    email:String,
    position:String
})
const TeacherCoursesSchema = mongoose.Schema({
    teacherEmail:String,
    teacherName:String,
    courses:[{crs:String}],
    studentData:[{studentName:String,studentEmail:String,studentCourse:String}]
})
const EventsSchema = mongoose.Schema({
    teacherEvents:[{tevs:String}],
    studentJoinEvents:[{}]
})
const StudentCoursesSchema = mongoose.Schema({
    name:String,
    course:[{crstud:String}]
})
const QuizUsers = mongoose.model("quizuser",QuizUserSchema);
const QuizTeacherCourses =mongoose.model("quizTeacherCourse",TeacherCoursesSchema);
const StudentJoinedCourses = mongoose.model("studentJoincourse",StudentCoursesSchema);
const AllEvents = mongoose.model("allEvent",EventsSchema);
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get("/",(req,res)=>{
    res.send("Welcome to our site");
})
app.get("/login",function(req,res){
    res.send("Yes");
})

app.post("/mainScr/register",(req,res)=>{
    uName = req.body.name;
    userPosition=req.body.position;
    if(userPosition==="teacher"){
        teacherEmail = req.body.email;
    }
    else if(userPosition==="student"){
        studEmail=req.body.email;
        studName=req.body.name;
    }
    bcrypt.hash(req.body.password,saltRounds,(err,hash)=>{
        const newQuizUser = new QuizUsers({
            name:req.body.name,
            password:hash,
            email:req.body.email,
            position:req.body.position
        })
        newQuizUser.save();
    })
    if(userPosition==="teacher"){
        console.log("Yes");
        const newTeacherCourse = new QuizTeacherCourses({
            teacherEmail:req.body.email,
            teacherName:req.body.name,
            courses:[{crs:"demo"}],
            studentData:[{studentName:"demoS",studentEmail:"demoE",studentCourse:"demoC"}]
        })
        newTeacherCourse.save((err,data)=>{
            if(err){
                console.log(err);
            }
        });
    }
    
})
app.post("/mainScr/signin",(req,res)=>{
    uName = req.body.name;
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
                if(data.position==="teacher"){
                    teacherEmail = data.email;
                }
                else if(data.position==="student"){
                    studEmail=data.email;
                    studName=data.name;
                }
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
app.post("/mainScr/teacher/courses",(req,res)=>{
    res.send("Yes");
    QuizUsers.findOne({email:teacherEmail},(err,data)=>{
        if(err){
            console.log(err);
        }
        
    })
    QuizTeacherCourses.updateOne({
        teacherEmail:teacherEmail
    },
    {$push:{courses:{crs:req.body.course}}},(err,success)=>{
        if(err){
            console.log(err);
        }
       
    })
  
})
app.post("/mainScr/teacher/join",(req,res)=>{
    let reqCourse = req.body.studentCrsRequest;
    let reqEmail = req.body.studentEmailRequest;
    let isValidEmail = false;
    let isValidCourse = false;
    QuizUsers.findOne({email:reqEmail},(err,data)=>{
    if(err){
        console.log(err);
    }
    else{
        if(data===null){
            isValidEmail=false;
        }
        else if(data.position==="student"||data.position==="teacher"){
            isValidEmail=true;
        }
       
        if(isValidEmail){
            
            QuizTeacherCourses.find({teacherEmail:reqEmail},(err2,dat2)=>{
                if(err2){console.log(err2)}
                else{
                    let le = dat2[0].courses.length;
                    let arrCrs = [];
                    for(let i=0;i<le;i++){arrCrs.push(dat2[0].courses[i].crs);}
                    if(arrCrs.includes(reqCourse)){
                        isValidCourse=true;
                    }
                    
                    if(isValidCourse){
                        let alreadyRegistered = false;
                        let done=false;
                        let validate=false;
                        StudentJoinedCourses.find({name:studName},(err7,dat7)=>{
                            if(err7){
                                console.log(err7);
                            }
                            else{
                                console.log(dat7);
                                if(dat7.length===0){
                                    alreadyRegistered=false;
                                }
                                else{
                                    alreadyRegistered=true;
                                }
                                if(alreadyRegistered===false){
                                    
                                    const studDat = new StudentJoinedCourses({name:studName,
                                        course:[{crstud:reqCourse}]
                                    })
                                    studDat.save((err9,dat9)=>{
                                        if(err9){
                                            res.send("No");
                                        }
                                        else{
                                            done=true;
    
                                            QuizTeacherCourses.updateOne({teacherEmail:reqEmail},{
                                                $push:{studentData:{studentName:studName,studentEmail:studEmail,studentCourse:reqCourse}}          
                                               },(err1,dat1)=>{
                                                   if(err1){
                                                       console.log(err1);
                                                   }
                                                   else{
                                                    res.send("Yes");
                                                       
                                                   
                                                   }
                                                   
                                               })

                                        }
                                    });
                                    
                                }
                                else if(alreadyRegistered===true){
                                    console.log("yeahah");
                                    StudentJoinedCourses.find({name:studName}
                                        ,(err10,dat10)=>{
                                            let dat10array=[];
                                            if(dat10.length>0){
                                                for(let k=0;k<dat10[0].course.length;k++){
                                                    dat10array.push(dat10[0].course[k].crstud);
                                                }
                                            }
                                            if(dat10array.includes(reqCourse)){
                                                validate=false;
                                                res.send("Naah");
                                            }
                                            else{
                                                StudentJoinedCourses.updateOne({name:studName},{
                                                    $push:{
                                                        course:{crstud:reqCourse}
                                                    }
                                                },(err8,dat8)=>{
                                                    if(err8){
                                                        console.log(err8);
                                                        res.send("No");
                                                    }
                                                    else{
                                                        done=true;
                                                        QuizTeacherCourses.updateOne({teacherEmail:reqEmail},{
                                                            $push:{studentData:{studentName:studName,studentEmail:studEmail,studentCourse:reqCourse}}          
                                                           },(err1,dat1)=>{
                                                               if(err1){
                                                                   console.log(err1);
                                                               }
                                                               else{
                                                                res.send("Yes");
                                                                   
                                                               
                                                               }
                                                               
                                                           })
                                                        
                                                    }
                                                })
                                               
                                            }
                                        })
                                    
                                }
                            }
                        })
                        
                        
                            
                    }
                    else{
                        res.send("No");
                    }
                }
            })
            
        }
        else{
            res.send("No");
        }
    }
    })
})
app.post("/mainScr/teacher/delete",(req,res)=>{
   QuizTeacherCourses.updateOne({teacherEmail:teacherEmail},
    {$pull:{courses:{crs:req.body.del}}},(err,success)=>{
        if(err){
            console.log(err);
        }
        else{
            res.send("Yes");
        }
    }
    )
})
app.get("/data/courses",(req,res)=>{
    QuizTeacherCourses.find({teacherEmail:teacherEmail},(err,data)=>{
        let len = (data[0].courses).length;
        let courseData=[];
        for(let i=0;i<len;i++){
            courseData.push(data[0].courses[i].crs);
        }
        res.send(courseData);        
    })
})
app.get("/mainScr/authRenderer",(req,res)=>{
    QuizUsers.findOne({name:uName},(err,data)=>{
        if(err){
            console.log(err);
        }
       
    })
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
app.get("/data/studCourses",(req,res)=>{
    StudentJoinedCourses.find({name:studName},(err,data)=>{
        if(err){
            console.log(err);
        }
        res.send(data);
        console.log(data[0].course);
    })
})
app.get("/mainScr/teacher/courses",(req,res)=>{
    let reqC = [];
    QuizTeacherCourses.find({teacherEmail:teacherEmail},(err,data)=>{
        
        if(err){
            console.log(err);
        }
        else{
            let length2 = data[0].courses.length;
            for(let i=0;i<length2;i++){
                reqC.push(data[0].courses[i].crs);
            }  
            res.send(reqC);
        }
    })
})
app.listen(4000);