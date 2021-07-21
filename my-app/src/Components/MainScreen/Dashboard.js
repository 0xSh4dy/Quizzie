import { useState,useEffect } from "react";
import axios from "axios";
import StudentDashBoard from './StudentDashboard';
import RealQuiz from '../MainScreen/QuizHandler/RealQuiz';
let a =1;
function MyCourses(props){
    return <li key={a++}>{props}</li>
}
function EventDashboard(){
    return (
        <h1>Event Dashboard</h1>
    )
}
function Head(){
    return <h1>Upcoming tests..</h1>
}

let x1 = 0;

function Dashboard(){
    const [gotCourseData,setCourseData]=useState(false);
    const [dat,setDat] = useState([]);
    const [position,setPosition] = useState("");
    const [studQuiz,setStudQuiz] = useState([]);
    const [dataNotFound,setDataNotFound] = useState("Loading...");
    const [startTime,setStartTime] = useState(1000);
    const [startNow,setStartNow] = useState(false);
    const [startTimings,setStartTimings] = useState([]);
    const [timingsSet,setTimingsSet] = useState(false);
        useEffect(()=>{
            axios({
                method:"GET",
                url:"http://127.0.0.1:4000/mainScr/teacher/courses"
            }).then((results)=>{
                if(results.data!="No"){
                setDat(results.data);

                setCourseData(true);
            }
            else if(results.data==="No"){
                axios({
                    method:"GET",
                    url:"http://127.0.0.1:4000/mainScr/teacher/quizDat"
                }).then((respon)=>{
                    let datq = respon.data;
                    let len1=  datq.length;
                    let datArray = [];
                    console.log(respon.data);
                        let datq1 = datq.map(dat=>JSON.parse(dat));
                        const newArr = [...datq1];
                        setStudQuiz(newArr);
                        console.log(newArr);
                        let currentDate = new Date();
                        let quizTimings = [];
                        currentDate = currentDate.getTime();
                        for(let j1=0;j1<len1;j1++){
                          let quizDate = new Date(newArr[j1].date);
                          let quizActTime = newArr[j1].time;
                          let quizActT1 = quizActTime.split(0,2);
                          let quizActT2 = quizActTime.split(3,5);
                          quizActT1 = 3600*1000*parseInt(quizActT1);
                          quizActT2=60*1000*parseInt(quizActT2);

                          quizDate = quizDate.getTime();
                          quizDate+=(quizActT1+quizActT2);
                          let remTime = quizDate-currentDate;

                          let dataStore = {time:remTime,course:newArr[j1].course}
                          quizTimings.push(dataStore);
                        }
                        setStartTimings([...quizTimings]);
                        setTimingsSet(true);


                }).catch(error=>console.log(error));

            }
            }).catch(err=>console.log(err));

            return(
              <h1 style={{color:"red"}}>Connection error</h1>
            )
        },[]);

    useEffect(()=>{
        axios({
            method:"GET",
            url:"http://127.0.0.1:4000/mainScr/teacher/studentboard"
        }).then((resp)=>{
            setPosition(resp.data);
        })
        .catch(err=>console.log(err));
    },[])
    function activateTrigger(){
        if(startNow===false){
        setStartNow(true);
        }
    }
    function RenderQuizData(props){


        return <div className="renderQuizData" key={x1++}>

        <li>{props.date}</li>
        <li>{props.time}</li>
        <li>{props.course}</li>
        {startNow===true?<li>start</li>:<li>later</li>}
        </div>

    }
    if(gotCourseData===true&&position==="teacher"){
        const dat1 = [...dat];
        return <div className="dashClass">
            <h1 >My Courses</h1>
                <div className="dash">
                <div className="dash1">
                {dat1.map(MyCourses)}
                </div>
                <div className="dash2">
                <EventDashboard></EventDashboard>
                </div>
                </div>
        </div>
    }
    else if(position==="student"){
        let startTime = new Date();
        startTime = startTime.getTime();

        if(studQuiz.length===0){
            setTimeout(()=>{
                let curTime = new Date();
                curTime = curTime.getTime();
                setDataNotFound("No test scheduled right now");
            },30000);
            return <h1 style={{color:"white"}}>{dataNotFound}</h1>
        }

        console.log(studQuiz);
        let myarr = [...studQuiz];
        console.log(myarr[0].date);
        if(timingsSet===false){
        return <div>
        <Head></Head>
        {myarr.map(RenderQuizData)}
        </div>
        }
        else{
          {sessionStorage.setItem("courseName",startTimings[0].course)}
          return <RealQuiz/>
        }
    }
    else{
        return <h1 style={{color:"white"}}>Loading...</h1>
    }

}
export default Dashboard;
