const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const saltRounds=10;
const socketio = require('socket.io');
const io = socketio(server,{cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
var userPosition = "";
var uName="";
var teacherEmail="";
var studEmail = "";
var studName="";
var users = [];
const addUser = ({id,name,room})=>{
    const user = {id,name,room};
    users.push(user);
    return user;
}
const removeUser = (id)=>{
    const index = users.findIndex((user)=>user.id===id);
    if(index!=-1){
        return users.splice(index,1)[0];
    }
}
const getUser = (id)=>users.find((user)=>user.id===id);
const getUsersInRoom = (room)=>users.filter((user)=>user.room===room);
const connection_url = 'mongodb+srv://admin:BoAoAuyCcujHi0Ln@cluster0.qni0g.mongodb.net/NarutoDB?retryWrites=true&w=majority';
mongoose.connect(connection_url,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true});

// Schema for users
const QuizUserSchema = mongoose.Schema({
    name:String,
    password:String,
    email:String,
    position:String
})

// Client side socket
io.on('connection',(socket)=>{
    socket.on('join',({name,room},callback)=>{
        const user = addUser({id:socket.id,name,room});
        const usr = getUser(socket.id);
        // Auto generated messages
        socket.emit('message',{user:'quizzie',text:`${user.name}, welcome to the discussions zone`});

        // Join joins a user in a room
        socket.join(user.room);

    })
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message',{user:user.name,text:message});
    })
    socket.on('disconnec',()=>{
        console.log("User left");
    })
})
//Schema for courses made by teachers
const TeacherCoursesSchema = mongoose.Schema({
    teacherEmail:String,
    teacherName:String,
    courses:[{crs:String}],
    studentData:[{studentName:String,studentEmail:String,studentCourse:String}]
})

//Schema for Quiz events
const EventsSchema = mongoose.Schema({
    tEmail:String,
    teacherEvents:[{date:String,time:String,course:String,isSet:Boolean}]
})

//Schema for courses that a student has registered for
const StudentCoursesSchema = mongoose.Schema({
    email:String,
    course:[{crstud:String,crteach:String}]
})

//Schema for questions set by a teacher for a quiz
const QuestionSchema = new mongoose.Schema({
    email:String,
    courseQuiz:String,
    courseQuestions:[{ques:String,option1:String,option2:String,option3:String,option4:String}],
    courseAnswers:[{ans:String}]
})
const QuizQuestions = mongoose.model("quizQuestion",QuestionSchema);
const QuizUsers = mongoose.model("quizuser",QuizUserSchema);
const QuizTeacherCourses =mongoose.model("quizTeacherCourse",TeacherCoursesSchema);
const StudentJoinedCourses = mongoose.model("studentJoincourse",StudentCoursesSchema);
const AllEvents = mongoose.model("allEvent",EventsSchema);
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
        const studDat1 = new StudentJoinedCourses({email:studEmail,
            course:[{crstud:"demo",crteach:"demo@demo.demo"}]
        })
        studDat1.save();
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
        const newEvent = new AllEvents({
            tEmail:teacherEmail,
            teacherEvents:[{date:"demo",time:"demo",course:"demo",isSet:false}]
        })
        newEvent.save((err,res)=>{
            if(err){
                console.log(err);
            }
        });
    }
   res.send("Yes");
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
                                if(dat7.length===0){
                                    alreadyRegistered=false;
                                }
                                else{
                                    alreadyRegistered=true;
                                }
                                if(alreadyRegistered===false){

                                    const studDat = new StudentJoinedCourses({email:studEmail,
                                        course:[{crstud:reqCourse,crteach:reqEmail}]
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
                                    StudentJoinedCourses.find({email:studEmail}
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
                                                StudentJoinedCourses.updateOne({email:studEmail},{
                                                    $push:{
                                                        course:{crstud:reqCourse,crteach:reqEmail}
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
    StudentJoinedCourses.find({email:studEmail},(err,data)=>{
        if(err){
            console.log(err);
        }
        res.send(data);
    })
})

app.get("/mainScr/teacher/courses",(req,res)=>{
    let reqC = [];

    QuizTeacherCourses.find({teacherEmail:teacherEmail},(err,data)=>{

        if(err){
            console.log(err);
        }

        else{
            if(data.length===0){
                res.send("No");
            }
            else{

                let length2 = data[0].courses.length;
            for(let i=0;i<length2;i++){
                reqC.push(data[0].courses[i].crs);
            }
            res.send(reqC);
            }

        }
    })
})
app.get("/mainScr/teacher/quizDat",(req,res)=>{
    StudentJoinedCourses.find({email:studEmail},(err,data)=>{

        if(err){
            console.log(err);
        }
        else{
            let datLen = data.length;
            let studentCourses = [];
            let studentCourseTeacher = [];
            for(let i=1;i<datLen;i++){
                studentCourses.push(data[i].course[0].crstud);
                studentCourseTeacher.push(data[i].course[0].crteach);
            }
            let arrLen = studentCourses.length;
            let availableQuiz = [];
            async function getData(){
                for(let i=0;i<arrLen;i++){
                    let dat1 = await AllEvents.find({tEmail:studentCourseTeacher[i]},(err1,dat1)=>{
                        if(err1){
                            console.log(err1);
                        }
                        // const EventsSchema = mongoose.Schema({
                        //     tEmail:String,
                        //     teacherEvents:[{date:String,time:String,course:String,isSet:Boolean}]
                        // })
                        else{
                            if(dat1.length===0){
                                console.log("Error");
                            }
                            else{

                                let eventLength = dat1[0].teacherEvents.length;
                                for(let j=0;j<eventLength;j++){
                                    if(dat1[0].teacherEvents[j].date!='demo'){
                                        availableQuiz.push(JSON.stringify({date:dat1[0].teacherEvents[j].date,
                                        time:dat1[0].teacherEvents[j].time,
                                         course:dat1[0].teacherEvents[j].course,
                                            isSet:dat1[0].teacherEvents[j].isSet
                                        }))
                                    }
                                }
                            }
                        }
                    })
                }

                uniq = [...new Set(availableQuiz)];
                let validcourses = [];
                let coursesFromData = [];
                let coursesToSend = [];
                let dataToSend = [];
                StudentJoinedCourses.find({email:studEmail},(err11,dat11)=>{
                    dat11.forEach((dat12)=>{
                        validcourses.push(dat12.course[0].crstud);
                    })
                    uniq.forEach((dat13)=>{
                        let dat14 = JSON.parse(dat13);
                        dat14 = dat14.course;
                        coursesFromData.push(dat14);
                    })
                    validcourses.forEach((dat15)=>{
                        if(coursesFromData.includes(dat15)){
                            coursesToSend.push(dat15);
                        }

                    })
                    uniq.forEach((dat16)=>{
                        let dat17 = JSON.parse(dat16);
                        if(coursesToSend.includes(dat17.course)){
                            dataToSend.push(dat17);
                        }
                    })
                    for(let i=0;i<dataToSend.length;i++){
                        dataToSend[i]=JSON.stringify(dataToSend[i]);
                    }
                    res.json(dataToSend);
                })

            }
            getData();
        }
    })

})
app.post("/mainScr/teacher/setQuiz",(req,res)=>{
    AllEvents.updateOne({tEmail:teacherEmail},{
        $push:{
            teacherEvents:{
                date:req.body.quizDate,
                time:req.body.quizTime,
                course:req.body.course,
                isSet:false
            }
        }
    },(err,result)=>{
        if(err){
            console.log(err);
        }

    })
})
app.get("/mainScr/teacher/setQuiz",(req,res)=>{
    let quizAlreadySet = [];
    let questionsSet = [];
    AllEvents.find({tEmail:teacherEmail},(err,data)=>{
        if(err){
            throw err;
        }
        else{

            if(data.length===0){
                console.log("Err");
                res.send("Server side error");
            }
            else{
            let l1 = data[0].teacherEvents.length;
            for (let i=1;i<l1;i++){
                quizAlreadySet.push(data[0].teacherEvents[i].course);
                if(data[0].teacherEvents[i].isSet){
                    questionsSet.push(data[0].teacherEvents[i].course);
                }
            }
            res.json({
                alreadySetQuiz:quizAlreadySet,
                questionsSetQuiz:questionsSet
            }
            );
        }
        }
    })
})
app.get("/mainScr/teacher/studentboard",(req,res)=>{
    res.send(userPosition);
})
app.post("/mainScr/teacher/setQuiz/setQuestions",(req,res)=>{
    let dataReceived = req.body;

    let quesAnsData = [];
    let ansData = [];
    QuizQuestions.find({email:teacherEmail,courseQuiz:req.body[0].course},(err,data)=>{
        console.log(data.length);
        console.log(data);
        if(err){
            console.log(err);
        }
        else if(data.length===0){
            console.log("Not done");
            let l1 = req.body.length;
            for(let i=0;i<l1;i++){
                quesAnsData.push({
                    ques:dataReceived[i].question,
                    option1:dataReceived[i].option1,
                    option2:dataReceived[i].option2,
                    option3:dataReceived[i].option3,
                    option4:dataReceived[i].option4
                })
                ansData.push({ans:dataReceived[i].answer});

            }

            let dataToAdd = new QuizQuestions({
                email:teacherEmail,
                courseQuiz:req.body[0].course,
                courseQuestions:quesAnsData,
                courseAnswers:ansData
            })
            dataToAdd.save((error1,data1111)=>{
                if(error1){
                    console.log(error1);
                }
                else{
                    console.log(teacherEmail);
                    console.log(req.body[0].course);
                AllEvents.updateOne({tEmail:teacherEmail,"teacherEvents.course":req.body[0].course},{$set:{"teacherEvents.$.isSet":true,}},(myerr,mydat)=>{
                    console.log("Updating...");

                })
            }
            });
            // const EventsSchema = mongoose.Schema({
            //     tEmail:String,
            //     teacherEvents:[{date:String,time:String,course:String,isSet:Boolean}]
            // })

            console.log(quesAnsData);
            console.log(ansData);
        }
        else{
            console.log("Done");

        }
    })

    res.send("Done");
})
app.post("/mainScr/teacher/setQuiz/getQuestions",(req,res)=>{
  // const QuestionSchema = new mongoose.Schema({
  //     email:String,
  //     courseQuiz:String,
  //     courseQuestions:[{ques:String,option1:String,option2:String,option3:String,option4:String}],
  //     courseAnswers:[{ans:String}]
  // })
  let questionData = [];
  QuizQuestions.findOne({courseQuiz:req.body.course},(err,data)=>{
    const dl = data[0].length;
    for(let i=1;i<dl;i++){
      let dat1 = {
        
      }
    }
  })
  res.send("Data received")
})
server.listen(process.env.port||4000);
